require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
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

  let studio = null; 
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'ahh', address: 'ahh' })));
  });

  let film = null;
  beforeEach(async() => {
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'ahh', studio: studio._id, released: 2004, cast: [] })));
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
          dob: date.toISOString(),
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
    const actors = await Actor.create({ 
      name: 'ahhh', 
      dob: date, 
      pob: '',
      films: [] 
    });

    return request(app)
      .get(`/api/v1/actors/${actors._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'ahhh',
          dob: expect.any(String),
          pob: '',
          films: []
        });
      });
  });

  it('can update an actor by id', async() => {
    const actors = await Actor.create({ name: 'jeffry mcacterson' });

    return request(app)
      .put(`/api/v1/actors/${actors._id}`)
      .send({ name: 'jeff' })
      .then(res => { 
        const actorJSON = JSON.parse(JSON.stringify(actors));
        expect(res.body).toEqual({
          ...actorJSON,
          name: 'jeff'
        });
      });
  });

  it('can delete an actor by id', async() => {
    const actor = await Actor.create({ name: 'ahhh' });

    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual(actorJSON);
      });
  });
});
