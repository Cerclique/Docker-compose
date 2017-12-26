const City = require('../../models/city').model;


const initializeArray = () => {
    return result = City.find({})
        .then(list => {
            const tmp = [];
            list.forEach(city => {
                const obj = {name: city.name, resources: city.resources, isHarvested: false};
                tmp.push(obj);
            });
            return tmp;
        })
        .catch(err => {
            console.log(err)
        });
};

module.exports = { initializeArray };