'use strict';

const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
  project : {
    type : String,
    required : true,
    unique : true,
    name : String,
    age : Number,
  },
  name : {
    type : String,
    required : true,
  },
  age : {
    type : Number,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
});

module.exports = mongoose.model('resume', resumeSchema);