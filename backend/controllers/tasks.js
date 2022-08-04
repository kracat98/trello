const router = require('express').Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Table = require('../models/table')
const Task = require('../models/task')

router.post('/:tableId', bodyParser.json(), async (req, res) => {
    const tableId = req.params.tableId
    const newTask = req.body
    const table = await Table.findById(tableId)
    const task = await Task.create(newTask)

    table.tasks = table.tasks.concat(task._id)
    await table.save()

    res.status(200).json(task)
})

router.delete('/:tableId/:taskId', bodyParser.json(), async (req, res) => {
    const tableId = req.params.tableId
    const taskId = req.params.taskId
    const table = await Table.findById(tableId)
    table.tasks = table.tasks.filter((t) => t.toString() !== taskId)
    await table.save()
    
    await Task.findByIdAndDelete(taskId)
    res.status(200).end()
})
module.exports = router