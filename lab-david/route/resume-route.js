'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Resume = require('../model/resume');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const resumeRoute = module.exports = new Router();

resumeRoute.post('/api/resumes', jsonParser, (request,response,next) => {
  if(!request.body.project || !request.body.name || !request.body.age) {
    return next(httpErrors(400, 'project, name and age are required things' ));
  }

  return new Resume(request.body).save()
    .then(resume => {
      return response.json(resume);
    })
    .catch(next);
});

resumeRoute.get('/api/resumes/:id', (request,response,next) => {
  return Resume.findById(request.params.id)
    .then(resume => {
      if(!resume){
        throw httpErrors(404,`resume not found`);
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(resume);
    }).catch(next);
});

resumeRoute.delete('/api/resumes/:id',(request,response,next) => {
  return Resume.findByIdAndRemove(request.params.id)
    .then(resume => {
      if(!resume){
        throw httpErrors(404,`project was not found. go back to start, do not collect $200.`);
      }
      logger.log('info', `GET - returning a 204 status code`);
      return response.sendStatus(204);
    }).catch(next);
});

resumeRoute.get('/api/resumes/', (request,response) => {
  logger.log('info', 'GET - processing for a non-ID specific request');

  Resume.find({})
    .then(resume => {
      if(!resume){
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info',resume);
      return response.json(resume);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

// resumeRoute.delete('/api/resumes/:id', (request,response) => {
//   logger.log('info', 'DELETE - processing a delete request for a specific id');

//   Resume.findById(request.params.id)
//     .then(resume => {
//       if(!resume){
//         logger.log('info', 'DELETE - returning a 404 status code');
//         return response.sendStatus(404);
//       }
//       logger.log('info', 'DELETE - returning a 200 status code');
//       logger.log('info',resume);

//       response.json(resume).delete();
//       return response.json(resume);

//     }).catch(error => {
//       if(error.message.indexOf('Cast to ObjectId failed') > -1){
//         logger.log('info', 'DELETE - returning a 404 status code. could not parse the id');
//         return response.sendStatus(404);
//       }
//       logger.log('error', 'DELETE - returning a 500 code');
//       logger.log('error', error);
//       return response.sendStatus(500);
//     });
// });

resumeRoute.put('/api/resumes/:id', jsonParser,(request,response,next) => {
  let options = {runValidators: true, new : true};

  return Resume.findByIdAndUpdate(request.params.id,request.body,options)
    .then(resume => {
      if(!resume){
        throw httpErrors(404, 'resume was not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(resume);
    }).catch(next);
});