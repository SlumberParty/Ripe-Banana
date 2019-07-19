require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

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

  it('get some reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'reviewer', company: 'company' },
      { name: 'reviewer2', company: 'company2' },
      { name: 'reviewer3', company: 'company3' }
    ]);

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ _id: reviewer._id, name: reviewer.name, company: reviewer.company });
        });
      });
  });

  it('can get a reviewer by id', async() => {
    const reviewer = await Reviewer.create({ name: 'ahhh', company: 'ahhh' });

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'ahhh',
          company: 'ahhh'
        });
      });
  });

  it('can update a reviewer by id', async() => {
    const reviewer = await Reviewer.create({ name: 'ahhh', company: 'ahhh' });

    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'whyyyy' })
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          ...reviewerJSON,
          name: 'whyyyy',
          company: 'ahhh'
        });
      });
  });
});
