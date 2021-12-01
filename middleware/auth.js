const jwt = require("jsonwebtoken");
const redisClient = require('../config/redis.config')

function SignAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME })
}

function VerifyAccessToken(req, res, next) {
    try {
        // Bearer tokenstring
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userData = decoded;

        req.token = token;
        // console.log("Verify Access Token",decoded,"ID for redis",decoded.userID)

        // varify blacklisted access token.
        redisClient.get('BL_' + decoded.userID.toString(), (err, data) => {
            if (err) throw err;

            if (data === token) return res.status(401).json({ status: false, message: "blacklisted token." });
            next();
        })
    } catch (error) {
        return res.status(401).json({ status: false, message: "Your session is not valid.", data: error });
    }
}


function GenerateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });

    redisClient.get(payload.userID.toString(), (err, data) => {
        if (err) throw err;

        redisClient.set(payload.userID.toString(), JSON.stringify({ token: refreshToken }), 'EX', 60 * 60, (err, reply) => {
            if (err) throw err;

        });
    })
    return refreshToken;
}

function VerifyRefreshToken(token) {

    if (token === null) throw "Empty Token";

    return new Promise((resolve, reject) => {

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        //, (err) => {if (err) return reject("Unauthorized! ",err)}
        // verify if token is in store or not
        redisClient.get(decoded.userID.toString(), (err, data) => {
            if (err) { 
                console.log(err);
                return reject("Server Error", err)
            }

            if (data === null) reject("Invalid request. Token is not in store.");
            if (JSON.parse(data).token != token) reject("Invalid request. Token is not same in store.");

            resolve(decoded);
            
        })
        

    })
}

module.exports = {
    SignAccessToken,
    VerifyAccessToken,
    GenerateRefreshToken,
    VerifyRefreshToken
}