const express = require('express');

const currentUserRouter = require('./routes/current-user');
const signinRouter = require('./routes/signin');
// const signoutRouter = require('./routes/signout');
const signupRouter = require('./routes/signup');
// import { errorHandler, NotFoundError } from '@sbticketingudemy/ticketing-udemy-common';
const cookieSession = require('cookie-session');

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.get('/api/users/test', (req, res) => {
  res.send('hello from shoppingcart.dev');
});

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
// app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  // next(new NotFoundError());
  next('404 not found');
});

// app.use(errorHandler);

module.exports = app;