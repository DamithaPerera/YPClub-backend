const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.connect().catch(console.error);

module.exports = client;
