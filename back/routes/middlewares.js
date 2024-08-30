module.exports = {
  isLoggedIn: (req, res, next) => {
    console.log('req.isAuthenticated():', req.isAuthenticated());
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인이 필요합니다.');
    }
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
  },
};
