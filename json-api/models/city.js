const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {type: String, required: true},
  lat: {type: Number, required: true},
  lng: {type: Number, required: true},
  resources: {type: Number, default: 0}
});

module.exports = {
  schema: citySchema,
  model: mongoose.model('City', citySchema),
  registry: {
    urlTemplates: {
      self: `${process.env.BASE_URL}/cities/{id}`,
      relationship: `${process.env.BASE_URL}/cities/${process.env.SUFFIX_URL}`
    }
  }
};
