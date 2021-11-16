const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProjectSchema = new Schema({
    name: { // Name of project
        type: String,
        require: true,
        unique: true 
    },
    description: {
        type: String,
    },
    startAt: {
        type: Date,
    },
    endAt: {
        type: Date,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('project', ProjectSchema)