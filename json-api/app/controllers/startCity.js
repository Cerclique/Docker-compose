const Truck = require('../../models/truck').model;
const City = require('../../models/city').model;

const Geolib = require('geolib');

const getTruckList = () => {
    return Truck.find({})
        .then(list => {
            return list;
        })
        .catch(err => console.log(err));
};

const getCityList = () => {
    return City.find({})
        .then(list => {
            return list;
        })
        .catch(err => console.log(err));
};

const computeNearest = async (truck, cityList) => {
    const formattedTruck = await formatTruck(truck);
    const result = await Geolib.orderByDistance(formattedTruck, cityList);
    return {
        index: Number(result[0].key),
        distance: Number(result[0].distance)
    };
};

const formatCitylist = (city) => {
    return {latitude: city.lat, longitude: city.lon};
};

const formatTruck = (truck) => {
    return {latitude: truck.lat, longitude: truck.lon};
};

const startCity = async () => {
    const truckList = getTruckList();
    const cityList = await getCityList();
    const formattedCityList = await cityList.map(city => formatCitylist(city));
    const cityIndex = await truckList.map(truck => computeNearest(truck, formattedCityList));
    const cityName = await cityIndex.map(element => {
        return {
            name: cityList[element.index].name,
            lat: cityList[element.index].lat,
            lon: cityList[element.index].lon
        };
    });

    return truckList.map((truck, index) => {
        return {
            Name: truck.name,
            City: cityName[index].name,
            Latitude: cityName[index].lat,
            Longitude: cityName[index].lon
        };
    });
};

module.exports = {startCity};