import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import userRouter from './server/routers/user.js'
import autionRouter from './server/routers/aution.js'

dotenv.config()

mongoose.connect(process.env.MONGO_STRING).then((r) => {
  console.log('db connected')
}).catch((err) => {
  console.log('connect db err', err)
})

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json({verify: (req, res, buf) => { req.rawBody = buf }}))

app.use(userRouter)
app.use(autionRouter)

app.use('/', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'not found',
  })
})

const server = http.createServer(app)
server.listen(PORT, () => {
  console.log('server at:', PORT)
})
