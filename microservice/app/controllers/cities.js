const {City} = require('../models/cities');

const createOrUpdateStock = (name, value) => {
    City.findOne({name})
        .then(city => {
            if (city) {
                city.previousValues.push(city.resources);
                city.previousValues.splice(0, city.previousValues.length - 10);
                city.resources = value;
                return city.save();
            }
            return new City({name, value}).save();
        })
        .catch(err => console.log(err));
};

module.exports = {createOrUpdateStock};
