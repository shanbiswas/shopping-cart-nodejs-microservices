const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const Token = require('../models/token');
const { Password } = require('../services/password');
const jwt = require('jsonwebtoken');

const amqp = require('amqplib/callback_api');

const signinRouter = express.Router();

signinRouter.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Passowrd is mandatory')
],
async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({email});
  if( !existingUser ) {
    res.send('Invalid credentials')
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);

  if( !passwordsMatch ) {
    res.send('Invalid credentials')
  }

  // generate JWT and save it on session object
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY);

  req.token = {
    jwt: userJwt
  };

  await Token.create({
    token: userJwt,
    user: existingUser
  })

  
  // Publish event with userId and token
  amqp.connect('amqp://rabbitmq-srv:15672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
  });
});

module.exports = signinRouter;