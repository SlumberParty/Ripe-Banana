require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
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
  
  let actor = null;
  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'ahh' })));
  });

  let studio = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'ahh' })));
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ 
        title: 'ahh', 
        studio: studio._id, 
        released: 2004, 
        cast: [{ 
          role: 'ahh', 
          actor: actor._id 
        }] 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'BlahBlah',
          studio: 'ahh',
          released: 2004, 
          cast: [{ 
            role: 'ahh', 
            actor: actor._id,
          }],
          __v: 0
        });
      });  
  });
});
