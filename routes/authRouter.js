const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require("express-validator")
const authMiddleware = require('../middleware/auth.middleware')

router.post('/registration',
    [
    check('email', "Email не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:1})
], controller.registration)
router.post('/login', controller.login)

router.get('/me', authMiddleware, controller.authMe)

module.exports = router