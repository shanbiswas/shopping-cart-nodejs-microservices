const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/product');

const getProductsRouter = express.Router();

getProductsRouter.get('/api/products/get-products', auth, async (req, res) => {
  const products = await Product.find();

  // send response to api
  res.send(products);
});

module.exports = getProductsRouter;