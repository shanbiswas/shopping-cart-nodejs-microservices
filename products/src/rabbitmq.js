// // const amqp = require('amqplib/callback_api');

// // let channel;

// // async function connect() {
// //   const amqpServer = 'amqp://rabbitmq-service:5672';
// //   const connection = amqp.connect(amqpServer);
// //   channel = await connection.createChannel();
// //   await channel.assertQueue('UserLoggedIn');
// // }
// // connect();

// // module.exports = {channel};

// const amqp = require("amqplib");
// var channel, connection;


// connectQueue() // call connectQueue function
// async function connectQueue() {
//     try {

//         connection = await amqp.connect("amqp://rabbitmq-service:5672");
//         channel = await connection.createChannel()
        
//         // connect to 'test-queue', create one if doesnot exist already
//         await channel.assertQueue("UserLoggedIn")
        
//     } catch (error) {
//         console.log('Rabbitmq err', error)
//     }
// }