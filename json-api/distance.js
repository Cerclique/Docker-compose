const bluebird = require('bluebird');
const distance = bluebird.promisifyAll(require('google-distance'));

const cityGraph = {
  BORDEAUX: {
    BORDEAUX: 0,
    LILLE: 0,
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  LILLE: {
    LILLE: 0,
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  LYON: {
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  MARSEILLE: {
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  NANTES: {
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  PARIS: {
    PARIS: 0,
    TOULOUSE: 0
  },
  TOULOUSE: {
    TOULOUSE: 0
  },
};

const generateDistance = () => {
  console.log('generateDistance');
  for (let cityOutter in cityGraph) {
    let obj = cityGraph[cityOutter];
    for (let cityInner in obj) {
      distance.get(
        {
          origin: cityOutter.toString(),
          destination: cityInner.toString()
        },
        function (err, data) {
          if (err) return console.log(err);
          let value = Math.floor(data.distanceValue / 1000);
          //console.log(value)
          //console.log(cityOutter + ' : ' + cityInner);
          cityGraph[cityOutter.toString().toUpperCase()][cityInner.toString().toUpperCase()] = 100;
          // console.log(cityGraph[cityOutter.toString()][cityInner.toString()]);
        });
    }
  }
  //console.log(cityGraph);
};

const getCityDistance = (origin, destination) => {
  // console.log('getCityDistance');
  // console.log(cityGraph[origin.toString()][destination.toString()]);
  return cityGraph[origin.toString().toUpperCase()][destination.toString().toUpperCase()];
};

const city = [
  'BORDEAUX',
  'PARIS',
  'TOULOUSE',
  'MARSEILLE',
  'NANTES',
  'LILLE',
  'LYON'
];

const distanceCity = {};

const computeDistance = async () => {
  city.sort();
  for (let i = 0; i < city.length; i++) {
    for (let x = i; x < city.length; x++) {
      let left = city[i].substring(0, 3).toLowerCase();
      let right = city[x].substring(0, 3).toLowerCase();

      const distance = (await getAPIDistance(city[i], city[x])).distanceValue;
      distanceCity[left.concat(right)] = Math.floor(distance / 1000);
    }
  }
  //console.log(distanceCity);
};

const getAPIDistance = (origin, destination) => {
  return distance.getAsync(
    {
      origin: origin,
      destination: destination
    })
};

module.exports = { computeDistance, distanceCity };