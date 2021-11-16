const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TenantMetadata = new Schema({
    userID : {
        type : mongoose.ObjectId,
        required : true
    }
})

module.exports = mongoose.model('tenant_metadatas', TenantMetadata )