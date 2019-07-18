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
      // .findById(req.params.id)
      // .select({
      //   _id: true,
      //   name: true,
      //   address: true,
      //   films: [{ 
      //     _id: true,
      //     title: true
      //   }]
      // })
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
    Studio
      .findByIdAndDelete(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });

