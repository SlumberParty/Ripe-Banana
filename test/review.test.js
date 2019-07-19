require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
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

  let studio = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'ahh' })));
  });
  
  let film = null;
  beforeEach(async() => {
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'ahh', studio: studio._id, released: 2004, cast: [] })));
  });
  
  let reviewer = null;
  beforeEach(async() => {
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'ahh', company: 'ahh' })));
  });

  it('can create a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ 
        rating: 1,
        reviewer: reviewer._id,
        review: 'fuck fuck fuck FUCK',
        film: film._id,
      })
      .then(res => {
        // console.log(res.body);
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 1,
          reviewer: reviewer._id,
          review: 'fuck fuck fuck FUCK',
          film: film._id,
          __v: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });  
  });

  it('gets some reviews', async() => {
    await Review.create([...Array(100)].map((review, i) => ({
      rating: 1, 
      reviewer: reviewer._id,
      review: `my review number ${i}`,
      film: film._id
    })));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
       
      });
  });
});
