const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.jwtKey);
};

userSchema.virtual('public').get(function() {
  return ['_id', 'name', 'email', 'avatar', 'date'];
});

const User = mongoose.model('User', userSchema);

function validateRegister(req) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };

  return Joi.validate(req, schema);
}

function validateLogin(req) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };

  return Joi.validate(req, schema);
}

module.exports.User = User;
module.exports.validateLogin = validateLogin;
module.exports.validateRegister = validateRegister;