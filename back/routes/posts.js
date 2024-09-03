const express = require('express');
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // req.body.lastId
    const posts = await Post.findAll({
      // where: {
      //   id: lastId,
      // },
      limit: 10, // offset: 0, // 0 ~ 10 개
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'id', 'DESC'],
      ],
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'nickname'] }],
        },
        { model: User, as: 'Likers', attributes: ['id'] },
      ],
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
