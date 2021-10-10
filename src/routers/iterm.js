const express = require('express')
const Iterm = require('../models/iterm')
const auth = require('../middleware/auth')
// const Task = require('../models/iterm')
const router = new express.Router()

router.post('/iterm',auth, async(req, res) => {
    const item = new Iterm({
        ...req.body,
        owner: req.user._id
    })

    try {
        await item.save()
        res.status(201).send(item)
    } catch (e) {
        res.status(400).send(e)
    }
})




router.get('/iterm', auth, async (req, res) => {
    try {
        // console.log("hereee")
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/iterm/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Iterm.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/iterm/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description','price','location','quantity']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Iterm.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/iterm/:id', auth, async (req, res) => {
    try {
        const task = await Iterm    .findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})




module.exports = router