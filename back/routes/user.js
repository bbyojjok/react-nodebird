const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          { model: Post, attributes: ['id'] },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    } else {
      return res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId: id } = req.params;
    const fullUserWithoutPassword = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['password'],
      },
      include: [
        { model: Post, attributes: ['id'] },
        {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      return res.status(200).json(fullUserWithoutPassword);
    } else {
      return res.status(404).send('존재하지 않는 유저입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          { model: Post, attributes: ['id'] },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
      return res.send('ok');
    });
  });
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(403).send('이미 사용중인 이메일 입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickname,
      password: hashedPassword,
    });
    return res.status(201).send('ok');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const { id: UserId } = req.user;
    const user = await User.findOne({ where: { id: UserId } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    await User.update(
      { nickname },
      {
        where: {
          id: UserId,
        },
      },
    );
    return res.status(200).json({ nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const { userId: UserId } = req.params;
    const user = await User.findOne({ where: { id: UserId } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    await user.addFollowers(req.user.id);
    return res.status(200).json({ UserId: parseInt(UserId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const { userId: UserId } = req.params;
    const user = await User.findOne({ where: { id: UserId } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    await user.removeFollowers(req.user.id);
    return res.status(200).json({ UserId: parseInt(UserId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const { userId: UserId } = req.params;
    const user = await User.findOne({ where: { id: UserId } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    await user.removeFollowings(req.user.id);
    return res.status(200).json({ UserId: parseInt(UserId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    const followers = await user.getFollowers();
    return res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(403).send('존재하지 않는 아이디입니다.');
    }
    const followings = await user.getFollowings();
    return res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
