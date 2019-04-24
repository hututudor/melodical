const mongoose = require('mongoose');
const config = require('./config/env');

mongoose.connect(config.db)
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.connection.db.dropDatabase();
    console.log('Dropped database');
    process.exit(0);
  })
  .catch(err => {
    console.log('Error connecting to MongoDB ' + err)
    process.exit(1);
  });