const _ = require('lodash')
const mongoose = require('mongoose')
const { generateError } = require('../helpers/errorHelper')
const { generateHash } = require('../helpers/securityHelper')

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: 'username is required',
      index: { unique: true }
    },
    password: {
      type: String,
      required: 'password is required',
      select: false,
      minlength: [ 8, 'password is too short' ]
    },
    firstname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    }
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = generateHash(this.password)
  next()
})

class UserClass {
  static async create(data) {
    const User = mongoose.model('User')
    const newUser = new User(_.pick(data, ['firstname', 'lastname', 'username', 'password']))
    await newUser.save()
    return newUser.toJSON()
  }

  static async update(id, data) {
    const User = mongoose.model('User')
    const user = await User.findById(id)
    if (!user) {
      throw generateError(404, 'user not found')
    }
    user.firstname = data.firstname
    user.lastname = data.lastname
    user.username = data.username
    if (data.password) {
      user.password = data.password
    }
    const updatedUser = await user.save()
    return User.findById(updatedUser._id)
  }

  comparePassword(password) {
    return this.password === generateHash(password)
  }

  toJSON() {
    return {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username
    }
  }

  static async authenticate(username, password) {
    const User = mongoose.model('User')
    const user = await User.findOne({ username }).select('+password').exec()
    if (!user || !user.comparePassword(password)) {
      throw generateError(401, 'Forbidden: invalid username or password')
    }
    return user.toJSON()
  }
}

UserSchema.loadClass(UserClass)

module.exports = mongoose.model('User', UserSchema)
