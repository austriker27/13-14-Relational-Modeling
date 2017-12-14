'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Resume = require('../model/resume');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/resumes`;

const resumeMockupCreator = () => {
  return new Resume({
    name : faker.address.county(2),
    state  : faker.address.state(1),
    range : faker.address.county(2),
  }).save();
};

describe('/api/resumes', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Resume.remove({}));

  describe('POST /api/resumes', () => {
    test('should respond with a resume and a 200 status code if there is no error', () => {
      let resumeToPost = {
        name : faker.address.county(2),
        state : faker.address.state(1),
        range : faker.address.county(2),
      };
      return superagent.post(`${apiURL}`)
        .send(resumeToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(resumeToPost.name);
          expect(response.body.state).toEqual(resumeToPost.state);
          expect(response.body.range).toEqual(resumeToPost.range);
        });
    });
    test('should respond with a 400 code if we send an incomplete resume', () => {
      let resumeToPost = {
        name : faker.company.bsNoun(2),
      };
      return superagent.post(`${apiURL}`)
        .send(resumeToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    test('should respond with a 204 if there are no errors', () => {
      return resumeMockupCreator()
        .then(resume => {
          return superagent.delete(`${apiURL}/${resume._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('should respond with a 404 if the id is invalid', () => {
      return superagent.delete(`${apiURL}/superFakeID`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/resumes', () => {
    test('PUT should update resume and respond with a 200 if there are no errors', () => {

      let resumeToUpdate = null;

      return resumeMockupCreator()
        .then(resume => {
          resumeToUpdate = resume;
          return superagent.put(`${apiURL}/${resume._id}`)
            .send({name : 'SuperResume'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          console.log(response.body);
          expect(response.body.name).toEqual('SuperResume');
          expect(response.body.state).toEqual(resumeToUpdate.state);          
          expect(response.body._id).toEqual(resumeToUpdate._id.toString());
        });
    });
  });

  describe('GET /api/resumes', () => {
    test('GET should respond with a 200 status code if there is no error', () => {
      let resumeToTest = null;

      resumeMockupCreator()
        .then(resume => {
          resumeToTest = resume;
          return superagent.get(`${apiURL}/${resume._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(resumeToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(resumeToTest.name);
          expect(response.body.state).toEqual(resumeToTest.state);
          expect(response.body.range).toEqual(resumeToTest.range);
          
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/superFakeId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});