const express = require('express');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const _ = require('lodash');
const {User, validateLogin, validateRegister} = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body);
  if(error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send({ message: 'User already registered' });

  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  let avatar = gravatar.url(req.body.email, {
    s: '200',
    r: 'pg',
    d: '404'
  });

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
    avatar
  });

  await user.save();

  const token = user.generateAuthToken();
  res.send({
    user: _.pick(user, user.public),
    token
  });
});

router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body);
  if(error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send({ message: 'Email or password is incorrect' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send({ message: 'Email or password is incorrect' });

  const token = user.generateAuthToken();
  res.send({
    token
  });
});

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send({ message: 'Invalid token' });

  res.send({
    user: _.pick(user, user.public)
  });
});

module.exports = router;