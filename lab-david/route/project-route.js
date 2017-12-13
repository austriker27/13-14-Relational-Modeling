'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Project = require('../model/project');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const projectRoute = module.exports = new Router();

projectRoute.post('/api/projects', jsonParser, (request,response,next) => {
  if(!request.body.title || !request.body.language || !request.body.year) {
    return next(httpErrors(400, 'title, language and year are required things' ));
  }

  return new Project(request.body).save()
    .then(project => {
      return response.json(project);
    })
    .catch(next);
});

projectRoute.get('/api/projects/:id', (request,response,next) => {
  return Project.findById(request.params.id)
    .then(project => {
      if(!project){
        throw httpErrors(404,`project not found`);
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(project);
    }).catch(next);
});

projectRoute.delete('/api/projects/:id',(request,response,next) => {
  return Project.findByIdAndRemove(request.params.id)
    .then(project => {
      if(!project){
        throw httpErrors(404,`project was not found. go back to start, do not collect $200.`);
      }
      logger.log('info', `GET - returning a 204 status code`);
      return response.sendStatus(204);
    }).catch(next);
});

projectRoute.get('/api/projects/', (request,response) => {
  logger.log('info', 'GET - processing for a non-ID specific request');

  Project.find({})
    .then(project => {
      if(!project){
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info',project);
      return response.json(project);
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

projectRoute.delete('/api/projects/:id', (request,response) => {
  logger.log('info', 'DELETE - processing a delete request for a specific id');

  Project.findById(request.params.id)
    .then(project => {
      if(!project){
        logger.log('info', 'DELETE - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - returning a 200 status code');
      logger.log('info',project);

      response.json(project).delete();
      return response.json(project);

    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'DELETE - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

projectRoute.put('/api/projects/:id', jsonParser,(request,response,next) => {
  let options = {runValidators: true, new : true};

  return Project.findByIdAndUpdate(request.params.id,request.body,options)
    .then(project => {
      if(!project){
        throw httpErrors(404, 'project was not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(project);
    }).catch(next);
});