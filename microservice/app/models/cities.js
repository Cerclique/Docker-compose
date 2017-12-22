const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const maxMemory = values => {
    return values.length <= 10;
};

const citySchema = new Schema ({
    name: {type: String, required: true},
    lat: Number,
    lon: Number,
    resources: {type: Number, default: 0},
    previousValues : {
        type: [Number],
        validate: [maxMemory, '{PATH} exceeds the limit of 10']
    }
});

const City = mongoose.model('City', citySchema);

module.exports = {City};
