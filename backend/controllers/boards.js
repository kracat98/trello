const router = require('express').Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Board = require('../models/board')
const Table = require('../models/table')

router.get('/', async (req, res) => {

    const board = await Board.findById('62e8a1dc4d9ebf5a106ee1d0')
    await board.populate('tables')
    // await board.tables.map((t) => {return t.populate('tasks')}) 
    // console.log(board)
    res.status(200).json(board)
    
})

router.put('/', bodyParser.json(), async(req, res) => {
    const body = req.body
    body.tables = body.tables.map((t) => mongoose.Types.ObjectId(t))
    const board = await Board.findByIdAndUpdate('62e8a1dc4d9ebf5a106ee1d0', body)
    res.status(200).json(board)
})
module.exports = router
