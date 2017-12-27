const Truck = require('../../models/truck').model;
const City = require('../../models/city').model;

const fillCities = () => {
    const cities = [
        new City({name: 'Bordeaux', lat: 48.862725, lon: 2.287592000000018, resources: 0, previousValues: []}),
        new City({name: 'Lille', lat: 50.62924999999999, lon: 3.057256000000052, resources: 0, previousValues: []}),
        new City({name: 'Lyon', lat: 45.764043, lon: 4.835658999999964, resources: 0, previousValues: []}),
        new City({name: 'Marseille', lat: 43.296482, lon: 5.369779999999992, resources: 0, previousValues: []}),
        new City({name: 'Paris', lat: 48.85661400000001, lon: 2.3522219000000177, resources: 0, previousValues: []}),
        new City({name: 'Nantes', lat: 47.218371, lon: -1.553621000000021, resources: 0, previousValues: []}),
        new City({name: 'Toulouse', lat: 43.604652, lon: 1.4442090000000007, resources: 0, previousValues: []})
        ];

    cities.forEach(element => {
        element.save();
    });
};

const fillTruck = () => {
    const trucks = [
        new Truck({name: 'Roger', lat: 44.620909, lon: 4.389862999999991, path: []}),
        new Truck({name: 'Didier', lat: 49.391988, lon: 1.780033000000003, path: []}),
        new Truck({name: 'Bernard', lat: 43.7101728, lon: 7.261953199999994, path: []})
    ];

    trucks.forEach(element => {
        element.save();
    });
};

const fillDatabase = () => {
    City.find({}).count()
        .then(nb => {
            if (nb === 0) {
                fillCities();
            }
        })
        .catch(err => console.log(err));
    Truck.find({}).count()
        .then(nb => {
            if (nb === 0) {
                fillTruck();
            }
        })
        .catch(err => console.log(err));
};

module.exports = { fillDatabase };