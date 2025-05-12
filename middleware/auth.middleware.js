const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const Blacklist = require('../models/blacklist.model')
module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized => TOKEN NOT RETRIEVED' })
  }
  try {
    const blackListToken = await Blacklist.findOne({ token: token })
    console.log(blackListToken)
    if (blackListToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized => TOKEN BLACKLISTED' })
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    console.log(decoded)
    if (!decoded) {
      return res.status(401).json({ message: 'cookie has been tempered' })
    }

    const user = User.findById(decoded._id)
    req.user = user
    return next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: ' catch error => Unauthorized', error })
  }
}
