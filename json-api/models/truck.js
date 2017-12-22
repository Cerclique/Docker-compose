const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const truckSchema = new Schema({
  lat: {type: Number, required: true},
  lng: {type: Number, required: true},
  path: [{type: ObjectId, ref: 'City'}]
});

module.exports = {
  schema: truckSchema,
  model: mongoose.model('Truck', truckSchema),
  registry: {
    urlTemplates: {
      self: `${process.env.BASE_URL}/trucks/{id}`,
      relationship: `${process.env.BASE_URL}/trucks/${process.env.SUFFIX_URL}`
    }
  }
};
