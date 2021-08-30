const express = require('express')
const Iterm = require('../models/iterm')
const Task = require('../models/iterm')
const router = new express.Router()

router.post('/tasks', async(req, res) => {
    const task = new Iterm(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router