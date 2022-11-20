const User = require('../models/User')
// const bcrypt = require('bcryptjs')
// const {validationResult} = require('express-validator')
// const jwt = require('jsonwebtoken');
// const {secret} = require('../config/config');

// const generateAccessToken = (id) => {
//     const payload = {
//         id
//     }
//     return jwt.sign(payload, secret, {expiresIn: "24h"} )
// }
class usersController {
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Users error"})
        }
    }

    async deleteUser(req, res) {
        try {
            const {usersId} = req.body
            const users = await User.find()

            const delUsers = usersId.map(id =>{ const user = users.find(u => u._id == id); return user})

            if (delUsers.length !== usersId.length) {
                return res.status(400).json({message: `User no found`})
            }
            const deletedUsers = delUsers.map(async (user) => {const del = await User.deleteOne(user); return del})
            res.json(deletedUsers)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Delete error"})
        }
    }

    async blockUser(req, res) {
        try {
            const {usersId} = req.body
            const users = await User.find()

            const blUsers = usersId.map(id =>{ const user = users.find(u => u._id == id); return user })

            if (!!blUsers.find(u => u.status === 'blocked')) {
                return res.status(400).json({message: `One or more users already blocked`})
            }

            if (blUsers.length !== usersId.length) {
                return res.status(400).json({message: `User doesn't exist`})
            }

            const blockUsers = usersId.map(async id =>{ const user = await User.updateOne({_id: id}, {status: 'blocked'}); return user})
            res.json({blockUsers, status: "success block"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Block error"})
        }
    }

    async unblockUser(req, res) {
        try {
            const {usersId} = req.body
            const users = await User.find()

            const unBlUsers = usersId.map(id =>{ const user = users.find(u => u._id == id); return user })

            if (!!unBlUsers.find(u => u.status === 'unblocked')) {
                return res.status(400).json({message: `One or more users already unblocked`})
            }

            if (unBlUsers.length !== usersId.length) {
                return res.status(400).json({message: `User no found`})
            }
            const unblockUsers = usersId.map(async id =>{ const user = await User.updateOne({_id: id}, {status: 'unblocked'}); return user})

            res.json({unblockUsers, status: 'success'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Unblock error"})
        }
    }


}

module.exports = new usersController()