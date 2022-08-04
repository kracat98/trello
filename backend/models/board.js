const mongoose = require('mongoose')
const { Schema } = mongoose

const boardSchema = new mongoose.Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    tables: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Table',
        },
    ],
})

module.exports = mongoose.model('Board', boardSchema)
