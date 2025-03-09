const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('applicationsQueue', { durable: true });
        console.log('RabbitMQ connected and queue asserted.');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
};

connectRabbitMQ();

const getChannel = () => channel;

module.exports = { getChannel };
