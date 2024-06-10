const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const signupRouter = express.Router();

signupRouter.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be between 4 and 20')
],
async (req, res) => {
  const {email, password} = req.body;

  const existingUser = await User.findOne({ email });

  if( existingUser ) {
    res.send('Email in use');
  }

  const user = new User({email, password});
  await user.save();

  res.status(201).send(user);
});

module.exports = signupRouter;