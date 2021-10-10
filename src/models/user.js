const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const Iterm = require('../models/iterm')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true, 
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Iterm',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function () {   // method used for instances 
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}



// userSchema.statics.findByCredentials = async (email, password) => {   // static used for class 
//     console.log('ok1')
//     const user = await User.findOne({ email })
//     console.log('ok2',user)                     

//     if (!user) {
//         throw new Error('Unable to login')
//         console.log('1 st')
//     }
//     console.log('4 st')
//     const isMatch = await bcrypt.compare(password, user.password)
//     console.log('5 st',isMatch)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//                 console.log('2 st')

//     }
//      console.log('3 st')
//     return user
// }

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save',async function(next){


   const user =this
   // console.log("befor ",user)
   if(user.isModified('password')){
   user.password= await bcrypt.hash(user.password, 8)
   console.log(user.password,"its end \n")
   }
       // console.log("After",user)

    next()

})


// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Iterm.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User',userSchema )

module.exports = User