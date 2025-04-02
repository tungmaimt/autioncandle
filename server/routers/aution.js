import express from 'express'

import Aution from '../models/aution.js'
import User from '../models/user.js'

const router = express.Router()

const jwt_key = process.env.JWT_KEY
const AUTION_TIME_LONG = 180000

const decodeToken = (token) => {
  try {
    return jwt.verify(token, jwt_key)
  } catch (error) {
    return null
  }
}

const getUser = async (req) => {
  const token = req.get('token')
  if (!token) {
    return null
  }

  const data = decodeToken(token)
  if (!data || !data.id) {
    return null
  }

  const user = await User.findById(data.id)
  return user
}

const hideEmail = (email) => {
  const [firstPart, secondPart] = email.split('@')
  return `${firstPart.slice(0, 3)}@${secondPart}`
}

router.get('/aution', async (req, res) => {
  // get aution info
  const now = new Date()

  const activeAution = await Aution.findOne({
    start_time: { $lt: now },
    end_time: { $gt: now },
  })

  res.json({
    status: 200,
    data: !activeAution ? null : activeAution.toJSON(),
  })

  res.send({ status: 'ok' })
})

router.post('/aution', async (req, res) => {
  // post aution
  const amount = req.body.amount

  const now = new Date()

  const user = getUser(req)

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: 'unauthentication',
    })
  }

  if (!amount) {
    return res.status(401).json({
      status: 401,
      message: 'amount is required',
    })
  }

  const activeAution = await Aution.findOne({
    start_time: { $lt: now },
    end_time: { $gt: now },
  })

  if (!activeAution) {
    return res.json({
      status: 400,
      message: 'no aution now',
    })
  }

  const update = await Aution.updateOne(
    {
      id: activeAution.id,
      current_price: { $lte: amount - activeAution.price_step },
    },
    {
      current_price: amount,
      current_user: user.id,
      current_email: hideEmail(user.email),
    },
  )

  const aution = await Aution.findById(activeAution.id)

  if (update.modifiedCount > 0) {
    return res.json({
      status: 200,
      data: aution.toJSON(),
    })
  }

  res.status(400).json({
    status: 400,
    message: 'not meet required amount'
  })
})

router.post('/aution/create', async (req, res) => {
  // create new aution if not have 1 runing
  const now = new Date()

  const user = getUser(req)

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: 'unauthentication',
    })
  }

  const activeAution = await Aution.findOne({
    start_time: { $lt: now },
    end_time: { $gt: now },
  })

  if (activeAution) {
    return res.json({
      status: 200,
      data: !activeAution ? null : activeAution.toJSON(),
    })
  }

  const aution = new Aution({
    name: `aution_name_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`,
    start_price: 50000000,
    price_step: 5000000,
    start_time: now,
    end_time: new Date(now.getTime() + AUTION_TIME_LONG),
    current_price: 50000000,
    current_user: null,
    current_email: null,
    start_user: user.id,
  })

  await aution.save()

  res.json({
    status: 200,
    data: aution.toJSON(),
  })
})

export default router
