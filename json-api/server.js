const app = require('express')();
const API = require('json-api');
const mongoose = require('mongoose');
const { algoGen, getDistances, setDistances } = require('./algoGen');
const { computeDistance, distanceCity } = require('./distance');

require('dotenv').config();

const APIError = API.types.Error;
mongoose.connect(process.env.DB_URL, { useMongoClient: true });

const models = {
  City: require('./models/city').model,
  Truck: require('./models/truck').model
};

const registryTemplates = {
  cities: require('./models/city').registry,
  trucks: require('./models/truck').registry
};

const adapter = new API.dbAdapters.Mongoose(models);
const registry = new API.ResourceTypeRegistry(registryTemplates,
  { dbAdapter: adapter });

const docs = new API.controllers.Documentation(registry, { name: 'Truck API' });
const controller = new API.controllers.API(registry);
const front = new API.httpStrategies.Express(controller, docs);

const apiReqHandler = front.apiRequest.bind(front);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
  res.header('Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

const db = [
  'city',
  'truck'
];

app.options('*', (req, res) => {
  res.send();
});

app.get('/api', front.docsRequest.bind(front));


app.get('/algogen', (req, res) => {
  const start = req.query.start;
  const end = req.query.end;
  console.log(getDistances());
  const path = algoGen(start, end);
  
  res.json(path);
});

app.get('/getTrucks', (req, res) => {
  const ret =
    {
      truck1: ['END', 'START'],
      truck2: ['END', 'START'],
      truck3: ['END', 'START']
    };
  res.json(ret);
});

app.route(`/api/:type(${db.join('|')})`).get(apiReqHandler).post(apiReqHandler)
.patch(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id`).get(apiReqHandler)
.patch(apiReqHandler)
.delete(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id/relationships/:relationship`)
.get(apiReqHandler).post(apiReqHandler).patch(apiReqHandler)
.delete(apiReqHandler);

app.use((req, res) => {
  front.sendError(new APIError(404, undefined, 'Not Found'), req, res);
});

app.listen(process.env.PORT, async () => {
  await computeDistance();
  setDistances();
  console.log(`Server listening on : ${process.env.BASE_URL}`);
});

