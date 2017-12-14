'use strict';

const faker = require('faker');
const superagent = require('superagent');
const Resume = require('../model/resume');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/resumes`;

const resumeMockupCreator = () => {
  return new Resume({
    project : faker.company.bsNoun(2),
    name  : faker.internet.userName(1),
    age : faker.random.number(1),
  }).save();
};

describe('/api/resumes', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Resume.remove({}));

  describe('POST /api/resumes', () => {
    test('should respond with a resume and a 200 status code if there is no error', () => {
      let resumeToPost = {
        project : faker.company.bsNoun(2),
        name  : faker.internet.userName(1),
        age : faker.random.number(1),
      };
      return superagent.post(`${apiURL}`)
        .send(resumeToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.project).toEqual(resumeToPost.project);
          expect(response.body.name).toEqual(resumeToPost.name);
          expect(response.body.age).toEqual(resumeToPost.age);
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

    test('should respond with a 409 code if we send a resume with a project property, which is a unique property, that already exists', () => {
      return resumeMockupCreator()
        .then(resume => {
          return superagent.post(apiURL)
            .send({
              project : resume.project,
              name : resume.name,
              age : resume.age,
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
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
            .send({project : 'GhosTown'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          console.log(response.body);
          expect(response.body.project).toEqual('GhosTown');
          expect(response.body.name).toEqual(resumeToUpdate.name);          
          expect(response.body._id).toEqual(resumeToUpdate._id.toString());
        });
    });

    // bonus points : 
    // test('PUT should respond with a 409 code if we send a resume with a project property, which is a unique property, that already exists', () => {
    //   return resumeMockupCreator()
    //     .then(resume => {
    //       return superagent.put(apiURL)
    //         .send({
    //           project : resume.project,
    //           name : resume.name,
    //           age : resume.age,
    //         });
    //     })
    //     .then(Promise.reject)
    //     .catch(response => {
    //       expect(response.status).toEqual(409);
    //     });
    // });

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

          expect(response.body.project).toEqual(resumeToTest.project);
          expect(response.body.name).toEqual(resumeToTest.name);
          expect(response.body.age).toEqual(resumeToTest.age);
          
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