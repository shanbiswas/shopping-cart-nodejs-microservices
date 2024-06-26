const express = require('express');
const auth = require('../middleware/auth');

const currentUserRouter = express.Router();

currentUserRouter.get('/api/products/currentuser', auth, (req, res) => {
  res.send({
    currentUser: req.user || null,
    token: req.token || null,
  });
});

module.exports = currentUserRouter;