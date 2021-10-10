const express = require('express')
require('./db/mongoose') //here we not geting anything but we ensure the database connected to our application 
const userRouter = require('./routers/user') //geting use routes
const itermRouter = require('./routers/iterm')

const app = express()
const port = process.env.PORT || 3002

app.use(express.json()) // here we parseing json data with help of express 
app.use(userRouter)
app.use(itermRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

