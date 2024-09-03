const express = require('express');
const { Post, Comment, Image, User } = require('../models');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { content } = req.body;
    const { id: UserId } = req.user;
    const post = await Post.create({
      content,
      UserId,
    });
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
