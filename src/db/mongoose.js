const mongoose = require('mongoose')

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose }