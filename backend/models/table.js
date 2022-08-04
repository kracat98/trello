const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
})

module.exports = mongoose.model('Table', tableSchema)
