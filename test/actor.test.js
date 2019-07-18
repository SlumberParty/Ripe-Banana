require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

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

  it('can get actors', async() => {
    const actors = await Actor.create([
      { name: 'actor' },
      { name: 'actor2' },
      { name: 'actor3' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ _id: actor._id, name: actor.name });
        });
      });
  });

  it('can get a actor by id', async() => {
    const date = new Date();
    const actors = await Actor.create({ name: 'ahhh', dob: date, pob: '' });

    return request(app)
      .get(`/api/v1/actors/${actors._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'ahhh',
          dob: expect.any(String),
          pob: '',
          // films: [{ 
          //   _id: expect.any(String),
          //   title: '',
          //   released: ''
          // }]
        });
      });
  });
});
