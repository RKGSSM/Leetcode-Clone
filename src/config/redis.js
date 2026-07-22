const {  createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'side-country-macroswift-94113.db.redis.io',
        port: 11477
    }
});

module.exports = redisClient;