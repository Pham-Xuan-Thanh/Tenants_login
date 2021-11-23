const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TenantSchema = new Schema({
    companyName: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
    }
})

module.exports = mongoose.model('tenants', TenantSchema)