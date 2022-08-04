const router = require('express').Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Board = require('../models/board')
const Table = require('../models/table')
const Task = require('../models/task')

router.get('/:tableId', bodyParser.json(), async (req, res) => {
    const tableId = req.params.tableId
    const table = await Table.findById(tableId)
    await table.populate('tasks')
    res.status(200).json(table)
})

router.post('/', bodyParser.json(), async (req, res) => {
    const name = req.body
    const board = await Board.findById('62e8a1dc4d9ebf5a106ee1d0')
    const table = await Table.create(name)

    board.tables = board.tables.concat(table._id)
    await board.save()

    res.status(201).json(table)
})

router.put('/:tableId', bodyParser.json(), async (req, res) => {
    const body = req.body
    body.tasks = body.tasks.map((t) => mongoose.Types.ObjectId(t))
    const table = await Table.findByIdAndUpdate(body._id, {tasks: body.tasks})
    console.log(body)
    res.json(table)
})

router.delete('/:tableId', bodyParser.json(), async (req, res) => {
    const tableId = req.params.tableId
    const board = await Board.findById('62e8a1dc4d9ebf5a106ee1d0')
    board.tables = board.tables.filter((t) => t.toString() !== tableId)
    await board.save()

    const table = await Table.findById(tableId)
    await Promise.all(table.tasks.map((taskId) => {
        return Task.findByIdAndDelete(taskId)
    }))

    await Table.findByIdAndDelete(tableId)
    res.status(200).end()
})

module.exports = router
