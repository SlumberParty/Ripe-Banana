const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({
        _id: true,
        name: true
      })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .select({
        _id: false,
        name: true,
        dob: true,
        pob: true,
        // films: [{ 
        //   _id: true,
        //   title: true,
        //   released: true
        // }]
      })
      .then(actor => res.send(actor))
      .catch(next);
  });
