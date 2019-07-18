require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

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
          title: 'ahh', 
          studio: studio._id, 
          released: 2004, 
          cast: [{ 
            _id: expect.any(String),
            role: 'ahh', 
            actor: actor._id,
          }],
          __v: 0
        });
      });  
  });

  it('get some films', async() => {
    const films = await Film.create([
      {
        title: 'ahh', 
        studio: studio._id, 
        released: 2004, 
        cast: [{ 
          role: 'ahh', 
          actor: actor._id,
        }]
      },
      {
        title: 'ahh2', 
        studio: studio._id, 
        released: 2004, 
        cast: [{ 
         
          role: 'ahh', 
          actor: actor._id,
        }]
      },
      {
        title: 'ahh3', 
        studio: studio._id, 
        released: 2004, 
        cast: [{
          role: 'ahh', 
          actor: actor._id,
        }]
      }
    ]);

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          console.log(film);
          expect(res.body).toContainEqual({
            _id: film._id,
            title: film.title, 
            studio: studio._id, 
            released: 2004, 
            cast: [{ 
              _id: expect.any(String),
              role: 'ahh', 
              actor: actor._id,
            }]
          });
        });
      });
  });
});
