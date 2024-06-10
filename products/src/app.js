const express = require('express');

const cookieSession = require('cookie-session');
const currentUserRouter = require('./routes/current-user');
const userLoggedInRouter = require('./routes/user-logged-in');

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.get('/api/products/test', (req, res) => {
  res.send('hello from shoppingcart.dev products service');
});

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(userLoggedInRouter);

app.all('*', async (req, res, next) => {
  // next(new NotFoundError());
  next('404 not found');
});

// app.use(errorHandler);

module.exports = app;