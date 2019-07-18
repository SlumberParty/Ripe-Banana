const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { 
      name,
      company
    } = req.body;

    Reviewer
      .create({ name, company })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({
        _id: true,
        name: true,
        company: true
      })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .select({
        _id: true,
        name: true,
        company: true,
        // reviews: [{
        //   _id: true,
        //   rating: true, 
        //   review: true,
        //   film: { 
        //     _id: true, 
        //     title: true
        //   }
        // }]
      })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { name } = req.body;

    Reviewer
      .findByIdAndUpdate(req.params.id, { name }, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  });
