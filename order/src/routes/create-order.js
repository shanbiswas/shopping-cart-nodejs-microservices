const amqp = require('amqplib/callback_api');
const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/product');
const Order = require('../models/order');

const createProductsRouter = express.Router();

createProductsRouter.post('/api/orders/create-order', auth, async (req, res) => {
  const products = req.body;

  // get productIDs
  const productIds = products.map(p => p.productId);

  const productDetails = await Product.find().where('_id').in(productIds).exec();
  const updatedProductData = [];

  const productList = [];
  productDetails.forEach((product) => {
    const qtyCustomerAskedFor = products.find(p => p.productId === product.id);
    productList.push({
      productId: product.id,
      price: product.price,
      quantity: qtyCustomerAskedFor.quantity,
    });

    updatedProductData.push(
      {
        updateOne: { 
          filter: { _id: product.id }, 
          update: { quantity: product.quantity - qtyCustomerAskedFor.quantity } 
        }
      }
    );
  });

  // create order
  const orderObj = new Order({
    userId: req.user.id || null,
    products: productList
  });
  await orderObj.save()

  // update the product qty
  const updatedProducts = await Product.bulkWrite(updatedProductData);


    // Publish event with userId and token
    amqp.connect('amqp://rabbitmq-service', function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }
  
          var queue = 'OrderCreated';
          var msg = products;
          msg = JSON.stringify(msg);
  
          channel.assertExchange(queue, 'fanout', {
              durable: false
          });
          // channel.sendToQueue(queue, Buffer.from(msg));
          channel.publish(queue, '', Buffer.from(msg));
  
          console.log("Sent OrderCreated", msg);
      });
      setTimeout(function() {
          connection.close();
          process.exit(0);
      }, 500);
    });

  // res.send('order created');
  res.send({
    order: orderObj,
    products: updatedProducts,
    up: updatedProductData
  });
});

module.exports = createProductsRouter;