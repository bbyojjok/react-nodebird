const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const app = express();
const PORT = 3065;

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log('db연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use('/', express.static(path.join(__dirname, 'uploads')));
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}
app.use(
  cors({
    origin: ['http://localhost:3060', 'nodebird.com'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log(req.url, req.method);
  res.send('hello backend !!');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
