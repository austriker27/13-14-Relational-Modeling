'use strict';

const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
  project : {
    required : true,
    unique : true,
    name : String,
  },
  name : {
    type : String,
    required : true,
  },
  age : {
    type : Number,
  },
});

module.exports = mongoose.model('resume', resumeSchema);