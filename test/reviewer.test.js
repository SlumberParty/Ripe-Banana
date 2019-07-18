require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'ahhh', company: 'ahhh' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'ahhh',
          company: 'ahhh',
          __v: 0
        });
      });  
  });
});
