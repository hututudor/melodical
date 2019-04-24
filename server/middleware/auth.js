const jwt = require('jsonwebtoken');
const config = require('../config/env');

module.exports = function(req, res, next) {
  const token = req.header('x-token');
  if(!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, config.jwtKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
};