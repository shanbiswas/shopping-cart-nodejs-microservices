const express = require('express');
const auth = require('../middleware/auth');

const currentUserRouter = express.Router();

currentUserRouter.get('/api/users/currentuser', auth, (req, res) => {
  res.send({currentUser: req.user || null});
});

module.exports = currentUserRouter;