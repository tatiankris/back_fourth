const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    registrationDate: {type: Date, required: true},
    lastLoginDate: {type: Date, required: true},
    status: {type: String, required: true},
})

module.exports = model('User', User)