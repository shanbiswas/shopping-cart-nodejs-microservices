const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/order');

const getOrdersRouter = express.Router();

getOrdersRouter.get('/api/orders/get-orders', auth, async (req, res) => {
  const userId = req.user.id || null;

  const orders = await Order.find({userId});
  res.send(orders);
});

module.exports = getOrdersRouter;