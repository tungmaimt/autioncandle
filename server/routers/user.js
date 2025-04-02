import express from 'express'
import jwt from 'jsonwebtoken'
import { createHash } from 'crypto'

import User from '../models/user.js'

const router = express.Router()
const jwt_key = process.env.JWT_KEY
const pass_hash_key = process.env.JWT_KEY

const hashPassword = (text) => {
  return createHash('sha256').update(pass_hash_key).update(text).digest('base64')
}

const signToken = (data) => {
  return jwt.sign(data, jwt_key)
}

router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: `require email and password`,
    })
  }

  const user = await User.findOne({
    email,
    password: hashPassword(password)
  })

  if (!user) {
    return res.status(400).json({
      status: 400,
      message: `email or password are incorrect`,
    })
  }

  res.json({
    status: 200,
    data: {
      email,
      token: signToken({ id: user.id, timestamps: Date.now() }),
    }
  })
})

router.post('/register', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: `require email and password`,
    })
  }

  const existsUser = await User.findOne({
    email,
    password: hashPassword(password)
  })

  if (existsUser) {
    return res.status(400).json({
      status: 400,
      message: `email is already used`,
    })
  }

  const user = new User({
    email,
    password: hashPassword(password),
  })

  await user.save()

  res.json({
    status: 200,
    data: {
      email,
      token: signToken({ id: user.id, timestamps: Date.now() }),
    }
  })
})

export default router
