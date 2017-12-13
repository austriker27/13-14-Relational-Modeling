'use strict';

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title : {
    type : String,
    required : true,
    unique : true,
  },
  language : {
    type : String,
    required : true,
  },
  year : {
    type : Number,
    required : true,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
});

module.exports = mongoose.model('project', projectSchema);