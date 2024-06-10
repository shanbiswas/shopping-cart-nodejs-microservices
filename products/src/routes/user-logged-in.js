const express = require('express');

const userLoggedInRouter = express.Router();

userLoggedInRouter.post('/api/products/user-logged-in', (req, res) => {
  console.log(req.body);
  res.send('inputs received');
});

module.exports = userLoggedInRouter;