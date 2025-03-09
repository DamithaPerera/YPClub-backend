const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('applicationsQueue', { durable: true });
        console.info('RabbitMQ connected and queue asserted.');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
};

const closeRabbitMQ = async () => {
    try {
        if (channel) {
            await channel.close();
            console.info('RabbitMQ channel closed.');
        }
        if (connection) {
            await connection.close();
            console.info('RabbitMQ connection closed.');
        }
    } catch (error) {
        console.error('Error closing RabbitMQ:', error);
    }
};

if (process.env.NODE_ENV !== 'test') {
    connectRabbitMQ();
}

const getChannel = () => channel;
const getConnection = () => connection;

module.exports = { connectRabbitMQ, getChannel, getConnection, closeRabbitMQ };
