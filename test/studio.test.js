require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

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

  it('get some studios', async() => {
    const studios = await Studio.create([
      { name: 'studio' },
      { name: 'studio2' },
      { name: 'studio3' }
    ]);

    return request(app)
      .get('/api/v1/studio')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual(studio);
        });
      });
  });

  it('can get a studio by id', async() => {
    const studio = await Studio.create({ name: 'ahhh' });

    return request(app)
      .get(`/api/v1/studio/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'ahhh',
          __v: 0
        });
      });
  });

  it('can update a studio by id', async() => {
    const studio = await Studio.create({ name: 'ahhh' });

    return request(app)
      .put(`/api/v1/studio/${studio._id}`)
      .send({ name: 'whyyyy' })
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual({
          ...studioJSON,
          name: 'whyyyy'
        });
      });
  });

  it('can delete a studio by id', async() => {
    const studio = await Studio.create({ name: 'ahhh' });

    return request(app)
      .delete(`/api/v1/studio/${studio._id}`)
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual(studioJSON);
      });
  });
});
