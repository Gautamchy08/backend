const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { body } = require('express-validator')

router.post(
  '/register',
  [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('registrationNo')
      .isNumeric()
      .isLength({ min: 11, max: 11 })
      .withMessage('Registration No must be exactly 11 digits'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  userController.registerUser
)

router.post(
  '/login',
  [
    body('registrationNo')
      .isNumeric()
      .isLength({ min: 11, max: 11 })
      .withMessage('Registration No must be exactly 11 digits'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  userController.loginUser
)
module.exports = router
