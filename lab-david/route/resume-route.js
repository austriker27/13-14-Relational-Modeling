'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Resume = require('../model/resume');
const httpErrors = require('http-errors');

const resumeRoute = module.exports = new Router();

resumeRoute.post('/api/resumes', jsonParser, (request,response,next) => {
  if(!request.body.name)
    return next(httpErrors(400, 'resume model requires a name'));

  return new Resume(request.body).save()
    .then(resume => response.json(resume))
    .catch(next);
});

resumeRoute.put('/api/resumes/:id', jsonParser,(request,response,next) => {
  let options = {runValidators : true, new : true};

  return Resume.findByIdAndUpdate(request.params.id,request.body,options)
    .then(resume => {
      if(!resume)
        throw httpErrors(404, 'resume was not found');      
      return response.json(resume);
    })
    .catch(next);
});

resumeRoute.get('/api/resumes/:id', (request,response,next) => {
  return Resume.findById(request.params.id)
    .then(resume => {
      if(!resume)
        throw httpErrors(404,`resume not found`);
      return response.json(resume);
    })
    .catch(next);
});

resumeRoute.delete('/api/resumes/:id',(request,response,next) => {
  return Resume.findByIdAndRemove(request.params.id)
    .then(resume => {
      if(!resume){
        throw httpErrors(404,`project was not found. go back to start, do not collect $200.`);
      }
      return response.sendStatus(204);
    }).catch(next);
});
