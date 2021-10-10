const express = require('express')
const User = require('../models/user') //loading user modal 
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body) //creating user object 

    try { // this try block run for awit function erro catching
        await user.save() // monooes midelware save method
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        const token = await user.generateAuthToken()  // here we only doing the work for instance see user and User differnce 
        // console.log(user,token)
        res.send({ user, token })
        // console.log(user,token)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})





router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.get('/users/:id', async(req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {    // mogodb if there any matches also return the sucess status so we are checking is there any user only we are processing 
            
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'phoneNo']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        console.log("hereeee")
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})






module.exports = router