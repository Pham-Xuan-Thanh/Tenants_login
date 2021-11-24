const jwt = require("jsonwebtoken");
const redisClient = require('../config/redis.config')

function SignAccesToken(payload) {
    return jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn : process.env.JWT_ACCESS_TIME})
}

function VerifyAccessToken(req,res,next) {
    try {
        // Bearer tokenstring
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userData = decoded;

        req.token = token;
        console.log("Verify Access Token",decoded,"ID for redis",decoded.userID)

        // varify blacklisted access token.
        redisClient.get('BL_' + decoded.userID.toString(), (err, data) => {
            if(err) throw err;

            if(data === token) return res.status(401).json({status: false, message: "blacklisted token."});
            next();
        })
    } catch (error) {
        return res.status(401).json({status: false, message: "Your session is not valid.", data: error});
    }
}


function GenerateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {expiresIn : process.env.JWT_REFRESH_TIME} );

    redisClient.get(payload.userID.toString(), (err, data) => {
        if(err) throw err;

        redisClient.set(payload.userID.toString(), JSON.stringify({token: refreshToken}), 'EX', 60*60, (err, reply)=> {
            if (err)  throw err;

        });
    })
    return refreshToken;
}

function VerifyRefreshToken(token) {

    if(token === null) return res.status(401).json({status: false, message: "Invalid request."});

    try {

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.userData = decoded;
        // verify if token is in store or not
        redisClient.get(decoded.userID.toString(), (err, data) => {
            if(err) throw err;
            
            if(data === null) return res.status(401).json({status: false, message: "Invalid request. Token is not in store."});
            if(JSON.parse(data).token != token) return res.status(401).json({status: false, message: "Invalid request. Token is not same in store."});

            next();
        })
    } catch (error) {
        return res.status(401).json({status: true, message: "Your session is not valid.", data: error});
    }
}

module.exports = {  SignAccesToken,
    VerifyAccessToken,
    GenerateRefreshToken,
    VerifyRefreshToken
 }