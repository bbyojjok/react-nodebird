const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport');

const app = express();
const PORT = 3065;

db.sequelize
  .sync()
  .then(() => {
    console.log('db연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(
  cors({
    origin: '*',
    credentials: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: 'nodebirdsecret',
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log(req.url, req.method);
  res.send('hello backend !!');
});

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
