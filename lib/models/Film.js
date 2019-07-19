const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true,
  },
  released: {
    type: Number,
    max: 9999,
    min: 1900,
    required: true,
  },
  cast: [{
    role: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true,
    },
  }]
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;

