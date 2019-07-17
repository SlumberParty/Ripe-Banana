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

  it('can create an actor', () => {
    const date = new Date();
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'ahhh', dob: date, pob: 'ahhh' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'ahhh',
          dob: expect.any(String),
          pob: 'ahhh',
          __v: 0
        });
      });
  });
});
