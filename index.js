const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter')
const PORT = process.env.PORT || 5000
const corsMiddleware = require('./middleware/cors.middleware')
const app = express()
const corsOptions = {
    origin: [],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}

app.use(cors(corsOptions))
app.use(corsMiddleware)
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://tatiana:tatiana@cluster0.k3j15yh.mongodb.net/task4?retryWrites=true&w=majority")
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
module.exports = app;