const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  dob: Date,
  pob: String
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
