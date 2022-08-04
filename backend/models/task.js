const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
    },
})

module.exports = mongoose.model('Task', taskSchema)
