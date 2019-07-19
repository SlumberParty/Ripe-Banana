const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { 
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .select({
        title: true, 
        studio: true, 
        released: true, 
        cast: [{  
          actor: true,
        }] 
      })
      .then(films => res.send(films))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .populate('studio', { name: true, _id: true })
      .populate('cast.actor', { name: true, _id: true })
      .select({ 
        _id: false,
        __v: false
      })
      .then(films => res.send(films))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film 
      .findByIdAndDelete(req.params.id)
      .then(film => res.send(film))
      .catch(next);
  });
