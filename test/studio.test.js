require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Studio = require('../lib/models/Studio');

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

  it('can create a studio', () => {
    return request(app)
      .post('/api/v1/studio')
      .send({ name: 'BlahBlah', address: {
        city: '',
        state: '',
        country: ''
      } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'BlahBlah',
          address: {
            city: '',
            state: '',
            country: ''
          },
          __v: 0
        });
      });  
  });
});

