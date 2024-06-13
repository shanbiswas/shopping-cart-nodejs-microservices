const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/product');
const amqp = require('amqplib/callback_api');

const createProductsRouter = express.Router();

createProductsRouter.post('/api/products/create-products', auth, async (req, res) => {
  const products = await Product.insertMany([
    {title: 'iPhone 11', price: 50000, quantity: 10},
    {title: 'MI note', price: 20000, quantity: 10},
    {title: 'Samsung galaxy', price: 15000, quantity: 10},
    {title: 'Redmi', price: 35000, quantity: 10}
  ]);

  // Publish event with userId and token
  amqp.connect('amqp://rabbitmq-service', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'ProductsCreated';
        var msg = {
          products
        };
        msg = JSON.stringify(msg);

        channel.assertExchange(queue, 'fanout', {
            durable: false
        });
        channel.publish(queue, '', Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
  });

  // send response to api
  res.send({
    message: 'products created',
    products
  });
});

module.exports = createProductsRouter;