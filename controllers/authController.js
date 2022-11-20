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
                return res.status(400).json({message: "Ошибка при регистрации", errors})
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
                return res.status(400).json({message: `Пользователь ${email} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            await User.updateOne({email}, {lastLoginDate: new Date()})
            const token = generateAccessToken(user._id)
            return res.json({token})
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