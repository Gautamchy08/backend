const userModel = require('../models/user.model')

const { validationResult, cookie } = require('express-validator')
const userService = require('../services/user.service')
module.exports.registerUser = async (req, res, next) => {
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
    // generating the token
    const token = await user.generateAuthToken()
    //setting the token in the cookie
    res.cookie('token', token)
    //sending the response to the client
    res.status(201).json({ token, user })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.loginUser = async (req, res, next) => {
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
    // generating the token
    const token = await existingUser.generateAuthToken()
    //setting the token in the cookie
    res.cookie('token', token)
    //sending the response to the client
    res.status(201).json({ token, existingUser })
  } catch (error) {
    // Handle errors
    console.error('Error login user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
