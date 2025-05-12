const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  registrationNo: {
    type: Number,
    required: true,
    unique: true,
    min: [10000000000, 'Registration No must be exactly 11 digits'],
    max: [99999999999, 'Registration No must be exactly 11 digits']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  }
})
userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )
  return token
}

userSchema.statics.hashPassword = async password => {
  return await bcrypt.hash(password, 10)
}

userSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    throw new Error('Password not set')
  }
  return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('User', userSchema)
module.exports = userModel
