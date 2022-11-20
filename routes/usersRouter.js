const Router = require('express')
const router = new Router()
const controller = require('../controllers/usersController')
// const {check} = require("express-validator")
// const authMiddleware = require('./middlewaree/authMiddleware')
// const roleMiddleware = require('./middlewaree/roleMiddleware')

router.get('/', controller.getUsers)
router.put('/delete', controller.deleteUser)
router.put('/block', controller.blockUser)
router.put('/unblock', controller.unblockUser)

module.exports = router