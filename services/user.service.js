const userModel = require('../models/user.model')

module.exports.createUser = async ({ username, registrationNo, password }) => {
  if (!username || !registrationNo || !password) {
    throw new Error('All fields are required from services')
  }
  const user = await userModel.create({
    username,
    registrationNo,
    password
  })
  return user
}
