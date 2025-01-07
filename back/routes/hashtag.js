const express = require('express');
const { Op } = require('sequelize');
const { Hashtag, Post, Image, User, Comment } = require('../models');

const router = express.Router();

router.get('/:hashtag', async (req, res, next) => {
  // GET /hashtag/노드
  try {
    const where = {};
    const lastId = parseInt(req.query.lastId, 10);
    if (lastId) {
      where.id = { [Op.lt]: lastId };
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // offset: 0, // 0 ~ 10 개
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'id', 'DESC'],
      ],
      include: [
        { model: Hashtag, where: { name: decodeURIComponent(req.params.hashtag) } },
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'nickname'] }],
        },
        { model: User, as: 'Likers', attributes: ['id'] },
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
      ],
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
