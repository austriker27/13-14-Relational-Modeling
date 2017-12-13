'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Mountain = require('../model/mountain');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const mountainRoute = module.exports = new Router();

mountainRoute.post('/api/mountains', jsonParser, (request,response,next) => {
  if(!request.body.name || !request.body.state || !request.body.range) {
    return next(httpErrors(400, 'body and content are required' ));
  }

  return new Mountain(request.body).save()
    .then(mountain => {
      return response.json(mountain);
    })
    .catch(next);
});

mountainRoute.get('/api/mountains/:id', (request,response,next) => {
  return Mountain.findById(request.params.id)
    .then(mountain => {
      if(!mountain){
        throw httpErrors(404,`note not found`);
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(mountain);
    }).catch(next);
});

mountainRoute.delete('/api/mountains/:id',(request,response,next) => {
  return Mountain.findByIdAndRemove(request.params.id)
    .then(mountain => {
      if(!mountain){
        throw httpErrors(404,`mountain was not found. go back to start, do not collect $200.`);
      }
      logger.log('info', `GET - returning a 204 status code`);
      return response.sendStatus(204);
    }).catch(next);
});

mountainRoute.get('/api/mountains/', (request,response) => {
  logger.log('info', 'GET - processing for a non-ID specific request');

  Mountain.find({})
    .then(mountain => {
      if(!mountain){
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info',mountain);
      return response.json(mountain);
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

mountainRoute.delete('/api/mountains/:id', (request,response) => {
  logger.log('info', 'DELETE - processing a delete request for a specific id');

  Mountain.findById(request.params.id)
    .then(mountain => {
      if(!mountain){
        logger.log('info', 'DELETE - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - returning a 200 status code');
      logger.log('info',mountain);

      response.json(mountain).delete();
      return response.json(mountain);

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

mountainRoute.put('/api/mountains/:id', jsonParser,(request,response,next) => {
  let options = {runValidators: true, new : true};

  return Mountain.findByIdAndUpdate(request.params.id,request.body,options)
    .then(mountain => {
      if(!mountain){
        throw httpErrors(404, 'mountain was not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(mountain);
    }).catch(next);
});