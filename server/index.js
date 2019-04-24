const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config/env');

const users = require('./routes/users');

// Connect to MongoDB
mongoose.connect(config.db)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB: ' + err));

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/users', users);

app.get('/', (req, res) => res.send(req.headers));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on ${port}`));