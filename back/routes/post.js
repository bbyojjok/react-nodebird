const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성 합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const { content, image: img } = req.body;
    const { id: UserId } = req.user;
    const hashtags = content.match(/(#[^\s#]+)/g);
    const post = await Post.create({
      content,
      UserId,
    });

    if (hashtags) {
      console.log('##### hashtags:', hashtags);
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          }),
        ),
      );
      console.log('##### result:', result);
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (img) {
      if (Array.isArray(img)) {
        const images = await Promise.all(img.map((v) => Image.create({ src: v })));
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: img });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
        { model: User, attributes: ['id', 'nickname'] },
        { model: User, as: 'Likers', attributes: ['id'] },
      ],
    });
    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  try {
    console.log(req.files);
    return res.status(200).json(req.files.map((v) => v.filename));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const { postId: PostId } = req.params;
    const { id: UserId } = req.user;
    const { content } = req.body;
    const post = await Post.findOne({
      where: { id: PostId },
      include: [{ model: Post, as: 'Retweet' }],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글을 리트윗 할 수 없습니다.');
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗 했습니다.');
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
      ],
    });

    return res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const { postId: PostId } = req.params;
    const { id: UserId } = req.user;
    const { content } = req.body;
    const post = await Post.findOne({ where: { id: PostId } });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content,
      PostId,
      UserId,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: Post }, { model: User, attributes: ['id', 'nickname'] }],
    });
    return res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: UserId } = req.user;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.addLikers(UserId);
    return res.json({ PostId: post.id, UserId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: UserId } = req.user;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.removeLikers(UserId);
    return res.json({ PostId: post.id, UserId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: UserId } = req.user;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await Post.destroy({
      where: { id: postId, UserId },
    });
    return res.json({ PostId: parseInt(postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
