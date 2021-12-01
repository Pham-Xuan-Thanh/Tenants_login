const redis = require('redis');
try {
    var rediscl = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    
} catch (error) {
    console.log("Redis Connect error:", error);
}

rediscl.on("connect", function () {
    console.log("Redis plugged in.");
});

module.exports = rediscl;