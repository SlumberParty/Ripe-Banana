const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { 
      name,
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({
        _id: true,
        name: true
      })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio
        .findById(req.params.id)
        .select({ __v: false }),
      Film
        .find({ studio: req.params.id })
        .select({ title: true })
    ])
      .then(([studio, films]) => {
        res.send({ ...studio.toJSON(), films });
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { name } = req.body;

    Studio
      .findByIdAndUpdate(req.params.id, { name }, { new: true })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    // Studio
    //   .findById(req.params.id)
    Film.find({ studio: req.params.id })
      .then(films => {
        if(films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(film => res.send(film))
            .catch(next);
        } else {
          res.send({
            message: 'AAAAAAHHHHHH SCREAMING'
          });
        }
      })
      .catch(next);
  });

