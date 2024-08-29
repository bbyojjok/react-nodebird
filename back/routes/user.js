const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

router.post('/user', (req, res, next) => {
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
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post('/', async (req, res, next) => {
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

module.exports = router;
