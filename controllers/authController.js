const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: 'User with this name already exist'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({email, password: hashPassword,
                registrationDate: new Date(), lastLoginDate: new Date(),
                status: 'unblocked'
            })
            await user.save()
            return res.json({message: "User successfully registered"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: `User ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Invalid password`})
            }
            if(user.status === 'blocked') {
                return res.status(400).json({message: `User is blocked`})
            }
            await User.updateOne({email}, {lastLoginDate: new Date()})
            const token = generateAccessToken(user._id)
            const id = user._id
            const status = user.status
            return res.json({token, email, id, status})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
        }
    }

    async logout(req, res) {
        try {

        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Logout error"})
        }
    }
}
module.exports = new authController()