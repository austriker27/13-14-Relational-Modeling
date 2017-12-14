'use strict';

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title : {type: String,
    required: true,
    unique: true,
  },
  year : {type : Number},

  languages : [{type : String }],

  description : {type : String},
   
  resumes : [{type: mongoose.Schema.Types.ObjectId,
    ref : 'resume'}],
},{
  usePushEach : true,
});

module.exports = mongoose.model('project',projectSchema);