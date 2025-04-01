import express from 'express'
import http from 'http'
const app = express()

app.get('/', (req, res) => {
  res.send('hekekek')
})
const server = http.createServer(app)
server.listen(3000, () => {
  console.log('app at 3000')
})

// http.createServer(app).listen(3000, () => {
//   console.log('app at 3000')
// })
