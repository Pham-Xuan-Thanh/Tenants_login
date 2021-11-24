const redis = require('redis');
var rediscl = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

rediscl.on("connect", function () {
    console.log("Redis plugged in.");
});

module.exports = rediscl;