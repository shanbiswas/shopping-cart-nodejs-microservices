const mongoose = require('mongoose');
const app = require('./app');

const amqp = require('amqplib/callback_api');
const Token = require('./models/token');
const User = require('./models/user');
const Product = require('./models/product');



const start = async () => {
  if( !process.env.JWT_KEY ) {
    throw new Error('JWT_KEY must be defined');
  }
  if( !process.env.MONGO_URI_SHOPPING_CART ) {
    throw new Error('MONGO_URI_SHOPPING_CART must be defined');
  }

  
  try {
    await mongoose.connect(process.env.MONGO_URI_SHOPPING_CART);
    console.log('connected to mongodb from order service');

    // Listen to event 'UserLoggedIn'
    amqp.connect('amqp://rabbitmq-service', function(error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(async function(error1, channel1) {
        if (error1) {
          throw error1;
        }

        var queue = 'UserLoggedIn';
    
        channel1.assertExchange(queue, 'fanout', {
          durable: false
        });
    
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
    
        await new Promise((resolve, reject) => {
          channel1.assertQueue('', {
            exclusive: true
          }, function(error2, q) {
            if (error2) {
              throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel1.bindQueue(q.queue, queue, '');
      
            channel1.consume(q.queue, async function(msg) {
              if(msg.content) {
                console.log(" [x] %s", msg.content.toString());

                const data = JSON.parse(msg.content);
      
                // Save the message to MongoDB
                const newUser = new User({
                  _id: data.user.id,
                  email: data.user.email,
                });
                const newToken = new Token({
                  token: data.token,
                  user: data.user.id,
                });
    
                await newUser.save();
                await newToken.save();
                console.log('Message saved');
              }
              resolve(msg);
            }, {
              noAck: true
            });
          });
        })
        
      });

      connection.createChannel(async function(error1, channel2) {
        if (error1) {
          throw error1;
        }

        const queue2 = 'ProductsCreated';
    
        channel2.assertExchange(queue2, 'fanout', {
          durable: false
        });
    
        console.log(`Waiting for ProductsCreated messages in ${queue2}. To exit press CTRL+C`);
    
        await new Promise((resolve, reject) => {
          channel2.assertQueue('', {
            exclusive: true
          }, function(error2, q) {
            if (error2) {
              throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel2.bindQueue(q.queue, queue2, '');
      
            channel2.consume(q.queue, async function(msg) {
              if(msg.content) {
                console.log(" [x] %s", msg.content.toString());

                const data = JSON.parse(msg.content);
      
                // Save the message to MongoDB
                await Product.insertMany(data.products);
                console.log('Products saved');
              }
              resolve(msg);
            }, {
              noAck: true
            });
          });
        })
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