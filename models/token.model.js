const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TokenSchema = new Schema({
    userID : {
        type : mongoose.ObjectId,
        required : true
    },
    token : {
        type : String,
        required : true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('tokens', TokenSchema)