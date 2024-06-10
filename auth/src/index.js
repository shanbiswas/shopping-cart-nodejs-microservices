const mongoose = require('mongoose');
const app = require('./app');

const start = async () => {
  if( !process.env.JWT_KEY ) {
    throw new Error('JWT_KEY must be defined');
  }
  if( !process.env.MONGO_URI_SHOPPING_CART ) {
    throw new Error('MONGO_URI_SHOPPING_CART must be defined');
  }

  
  try {
    await mongoose.connect(process.env.MONGO_URI_SHOPPING_CART);
    console.log('connected to mongodb from auth service');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000 from auth service..!!');
  });
}

start();