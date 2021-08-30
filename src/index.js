const express = require('express')
require('./db/mongoose') //here we not geting anything but we ensure the database connected to our application 
const userRouter = require('./routers/user') //geting use routes
    // const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3005

app.use(express.json()) // here we parseing json data with help of express 
app.use(userRouter)
    // app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})