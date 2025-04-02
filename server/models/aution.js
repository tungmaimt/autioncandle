import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  start_price: Number,
  price_step: Number,
  start_time: Date,
  end_time: Date,
  current_price: Number,
  current_user: mongoose.Schema.Types.ObjectId,
  current_email: String,
  start_user: mongoose.Schema.Types.ObjectId,
})

const User = mongoose.model('Aution', userSchema)

export default User
