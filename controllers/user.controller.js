const { validationResult, cookie } = require('express-validator')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const blacklistModel = require('../models/blacklist.model')
module.exports.registerUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({
      registrationNo: req.body.registrationNo
    })
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }
    const { username, registrationNo, password } = req.body

    // hash password
    const hashedPassword = await userModel.hashPassword(password)
    if (!hashedPassword) {
      return res.status(422).json({ message: 'Password hashing failed' })
    }
    // sending the user data to the userService to create a new user
    const user = await userService.createUser({
      username: username,
      registrationNo: registrationNo,
      password: hashedPassword
    })

    //sending the response to the client
    res.status(201).json({ user })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    // Check if user already exists
    const { registrationNo, password } = req.body
    const existingUser = await userModel.findOne({
      registrationNo: registrationNo
    })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // comparing the password with the hashed password
    const isMatch = await existingUser.comparePassword(password)
    if (!isMatch) {
      return res.status(422).json({ message: 'Password does not match' })
    }
    // generating the accesstoken
    const accessToken = await existingUser.generateAccessToken()
    //setting the token in the cookie
    res.cookie('token', accessToken)
    //sending the response to the client
    // generating the refreshtoken
    const refreshToken = await existingUser.generateRefreshToken()
    //setting the token in the cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 28 * 24 * 60 * 60 * 1000 // 28 days
    })
    res.status(201).json({ accessToken, refreshToken, existingUser })
  } catch (error) {
    // Handle errors
    console.error('Error login user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized => TOKEN NOT RETRIEVED' })
    }
    await blacklistModel.create({
      token: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Set expiration date to 7 days from now
    })
    // Clear the refresh token cookie
    res.clearCookie('refreshToken')
    // Clear the access token cookie
    res.clearCookie('accessToken')
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error logging out user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.tokenRefreshing = async (req, res) => {
  try {
    // extract the refresh token from the request
    const refreshToken = req.cookies.refreshToken
    // error handling
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized => TOKEN NOT RETRIEVED' })
    }
    // Check if the refresh token is blacklisted previously
    const blackListToken = await blacklistModel.findOne({ token: refreshToken })
    if (blackListToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized => TOKEN BLACKLISTED' })
    }
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    if (!decoded) {
      return res.status(401).json({ message: 'cookie has been tempered' })
    }
    // Find the user associated with the refresh token
    const user = await userModel.findById(decoded._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    // Generate a new access token

    const newAccessToken = await user.generateAccessToken()
    // Set the new access token in the cookie
    res.cookie('accessToken', newAccessToken)
    res.status(200).json({ newAccessToken })
  } catch (error) {
    console.error('Error refreshing token:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
