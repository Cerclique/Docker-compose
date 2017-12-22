const { distanceCity } = require('./distance');

let city = [      // contains the resources to harvest
  {
    "name": 'BORDEAUX',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'LILLE',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'LYON',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'MARSEILLE',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'NANTES',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'PARIS',
    "resources": 0,
    "isHarvested": false
  },
  {
    "name": 'TOULOUSE',
    "resources": 0,
    "isHarvested": false
  }
];

let distances = {};


const limitKM = 3000;           // malus will apply if overreach
const malusPerHundredKM = 25;   // malus ratio
let error = Infinity;
const arrAvgOldScore = [];
// const randomGenRatio = 1;       // nb of children generated randomly
const maxChromosomeLength = 20;
const minChromosomeLength = 2;
let finalScore = [];
let finalDistance = [];

const getDistances = () => {
  return distances;
}

const setDistances = () => {
  distances = distanceCity;
}

/* const setDistances = (dist) => {
  distances = dist;
} */

const setCity = () => {
  city = [];
}

const algoGen = (depCity, arrCity, errorThreshold = 0.01, maxIteration = 100, nbChromosome = 15, mutationOdd = 0.1) => {
  depCity = depCity.toLocaleUpperCase();
  arrCity = arrCity.toLocaleUpperCase();

  const keepParent = Math.round(0.73 * nbChromosome);           // nb of parents to keep at each iteration

  // Filling up cities with resources
  city.forEach(clemence => {
    clemence.resources = Math.floor(Math.random() * 1000);
  });

  // Creation of parent chromosomes - Initialization
  let arrChromosomes = [];

  for (let i = 0; i < keepParent; i++) {
    const trisomie = [];
    const rndLength = minChromosomeLength + Math.random() * (maxChromosomeLength - minChromosomeLength) - 1;
    for (let x = 0; x < rndLength; x++) {
      let simba = Math.floor(Math.random() * city.length);
      while (x > 0 && simba === trisomie[x - 1]) {
        simba = Math.floor(Math.random() * city.length);
      }
      trisomie.push(simba);
    }
    trisomie.push(city.findIndex(jpp => jpp.name === arrCity));
    arrChromosomes.push(trisomie);
  }

  let cpt = 0;

  do {
    /*******************************************/
    /** Creation of crossOverGenRatio% clidren */
    /*******************************************/
    const arrChildren = [];
    for (let i = 0; i < nbChromosome - keepParent; i++) {
      const firstParent = Math.floor(Math.random() * arrChromosomes.length);
      const secondParent = Math.floor(Math.random() * arrChromosomes.length);
      let idxFirstParent = Math.floor(Math.random() * (arrChromosomes[firstParent].length - 2));
      let idxSecondParent = Math.floor(Math.random() * (arrChromosomes[secondParent].length - 2));
      do {
        idxFirstParent = Math.floor(Math.random() * (arrChromosomes[firstParent].length - 2));
        idxSecondParent = Math.floor(Math.random() * (arrChromosomes[secondParent].length - 2));
      } while (idxFirstParent + (arrChromosomes[secondParent].length - idxSecondParent + 1) > maxChromosomeLength - 1);

      const childLength = idxFirstParent + arrChromosomes[secondParent].length - idxSecondParent;
      const newChild = [];
      let shift = 0;
      for (let x = 0; x < childLength; x++) {
        if (x < idxFirstParent) {
          newChild[x] = arrChromosomes[firstParent][x];
        } else {
          newChild[x] = arrChromosomes[secondParent][idxSecondParent + shift];
          shift += 1;
        }
      }
      arrChildren.push(newChild);
    }

    /*******************************************/
    /** Generate one clidren totally randomly **/
    /*******************************************/
    // const cocu = [];
    // const rndLength = minChromosomeLength + Math.random() * (maxChromosomeLength - minChromosomeLength) - 1;
    // for (let i = 0; i < rndLength; i++) {
    //     cocu[i] = Math.floor(Math.random() * city.length);
    // }
    // cocu.push(city.findIndex(lea => lea.name === arrCity));
    // arrChildren.push(cocu);

    /*******************************************/
    /************* Mutate children *************/
    /*******************************************/
    arrChildren.forEach(skibidiPahPah => {
      for (let i = 0; i < skibidiPahPah.length - 1; i++) {
        if (Math.random() < mutationOdd) {
          let newAllele = Math.floor(Math.random() * city.length);
          while (newAllele === skibidiPahPah[i]) {
            newAllele = Math.floor(Math.random() * city.length);
          }
          skibidiPahPah[i] = newAllele;
        }
      }
    });

    /*******************************************/
    /********* Add children to parents *********/
    /*******************************************/
    arrChildren.forEach(child => arrChromosomes.push(child));

    /*******************************************/
    /*** Checking chromosomes for repetition ***/
    /*******************************************/
    // rules are :
    arrChromosomes.forEach(chromo => {
      // 1. never the same city twice in a row
      if (chromo[0] === city.findIndex(prout => prout.name === depCity)) {
        chromo = chromo.slice(1);
      }
      for (let i = 1; i < chromo.length - 1; i++) {
        while (chromo[i - 1] === chromo[i] || chromo[i] === chromo [i + 1]) {
          chromo[i] = Math.floor(Math.random() * city.length);
        }
      }

      // 2. no more than twice the same city in a chromosome
      const distinctValueInChromo = [...new Set(chromo)];
      for (let i = 0; i < distinctValueInChromo.length; i++) {
        const redundantValue = distinctValueInChromo[i];
        let occurence = chromo.reduce((a, v) => (v === redundantValue) ? a + 1 : a, 0);
        while (occurence > 2) {
          const idxOccurence = chromo.indexOf(redundantValue);
          const temp = [];
          chromo.filter((v, i) => (idxOccurence !== i) ? temp.push(v) : v);
          chromo = temp;
          occurence = chromo.reduce((a, v) => (v === redundantValue) ? a + 1 : a, 0);
        }
      }
    });
    
    /*******************************************/
    /****** Compute scores of chromosomes ******/
    /*******************************************/
    const scoreChromosome = [];
    const distanceChromosome = [];

    arrChromosomes.forEach(chromo => {
      let resourceSum = 0;
      let distanceSum = 0;

      // Set resource as 'non-harvested'
      city.forEach(chloe => { chloe.isHarvested = false; });

      // Adding distance and resource for depCity
      resourceSum += city.filter(pauline => pauline.name === depCity)[0].resources;
      distanceSum += 10;

      // Adding the cities resources/distance of the current chromosome 'chromo'
      let prevCity = depCity.toLocaleLowerCase().slice(0, 3);
      chromo.forEach(gene => {
        // Adding resources
        let nextCity = city[gene];

        if (!nextCity.isHarvested) {
          resourceSum += nextCity.resources;
          nextCity.isHarvested = true;
        }

        // Adding distance
        nextCity = nextCity.name.toLocaleLowerCase().slice(0, 3);
        let keyDistanceArray = prevCity + nextCity;
        if (!distances[keyDistanceArray]) {
          keyDistanceArray = nextCity + prevCity;
        }
        distanceSum += distances[keyDistanceArray];

        prevCity = nextCity;
      });

      // Adjusting malus
      const malus = (distanceSum > limitKM) ? (distanceSum - limitKM) / 100 * malusPerHundredKM : 0;
      resourceSum -= malus;
      scoreChromosome.push(resourceSum);
      distanceChromosome.push(distanceSum);
    });

    /*******************************************/
    /* Updating moving avg (last 5 iterations) */
    /*******************************************/
    const avgCurrScore = scoreChromosome.reduce((a, b) => a + b, 0) / scoreChromosome.length;
    if (cpt > 4) {
      const avgOldScore = arrAvgOldScore.reduce((a, b) => a + b, 0) / arrAvgOldScore.length;
      error = Math.abs(avgOldScore - avgCurrScore) / avgOldScore;
    }
    arrAvgOldScore.push(avgCurrScore);
    if (arrAvgOldScore.length > 5) {
      arrAvgOldScore.shift();
    }

    /*******************************************/
    /**** Selection of keepParent% best chr ****/
    /*******************************************/
    const arrBestChrom = [];
    const copyScoreChromosome = scoreChromosome.slice();
    for (let i = 0; i < keepParent; i++) {
      const indexMax = copyScoreChromosome.findIndex(max => max === Math.max(...copyScoreChromosome));
      arrBestChrom.push(arrChromosomes[indexMax]);
      copyScoreChromosome[indexMax] = -Infinity;
    }
    arrChromosomes = arrBestChrom;

    cpt += 1;
    finalScore = scoreChromosome;
    finalDistance = distanceChromosome

  } while (error > errorThreshold && cpt < maxIteration);

  /*******************************************/
  /******* Creation of returned object *******/
  /*******************************************/
  const path = [];
  path.push(depCity);
  arrChromosomes[0].forEach(zerat0r => path.push(city[zerat0r].name));
  const pathScore = finalScore[0];
  const pathDistance = finalDistance[0];

  return { "path": path, "score": pathScore, "distance": pathDistance, "iteration": cpt, "error": error };
}


module.exports = { algoGen, getDistances, setDistances, setCity };