'use strict';

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title : {type: String,
    required: true,
    unique: true,
  },
  year : [{type : mongoose.Schema.TypesObjectId,
    ref : 'resume'}],
},{
  usePushEach : true,
});

module.exports = mongoose.model('resume',projectSchema);