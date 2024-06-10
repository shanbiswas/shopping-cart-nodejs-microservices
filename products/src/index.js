const mongoose = require('mongoose');
const app = require('./app');

const amqp = require('amqplib/callback_api');

const start = async () => {
  if( !process.env.JWT_KEY ) {
    throw new Error('JWT_KEY must be defined');
  }
  if( !process.env.MONGO_URI_SHOPPING_CART ) {
    throw new Error('MONGO_URI_SHOPPING_CART must be defined');
  }

  
  try {
    await mongoose.connect(process.env.MONGO_URI_SHOPPING_CART);
    console.log('connected to mongodb from products service');

    // Listen to event 'UserLoggedIn'
    amqp.connect('amqp://rabbitmq-srv:15672', function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }
  
          var queue = 'hello';
  
          channel.assertQueue(queue, {
              durable: false
          });
  
          console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
  
          channel.consume(queue, function(msg) {
              console.log(" [x] Received %s", msg.content.toString());
          }, {
              noAck: true
          });
      });
    });
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000 from products service..!!');
  });
}

start();