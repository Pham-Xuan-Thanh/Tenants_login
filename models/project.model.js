const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProjectSchema = new Schema({
    projectName: { // Name of project
        type: String,
        require: true,
        unique: true 
    },
    description: {
        type: String,
    },
    userCreated : {
        type : mongoose.ObjectId,
        required : true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
    },
    deleteAt: {
        type: Date,
    }
})

module.exports = mongoose.model('projects', ProjectSchema)