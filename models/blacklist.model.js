const mongoose = require('mongoose')
const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expires: {
    type: Date,
    required: true,
    index: { expires: 86400 } // 1 day in second
  }
})
const Blacklist = mongoose.model('Blacklist', blacklistSchema)
module.exports = Blacklist
