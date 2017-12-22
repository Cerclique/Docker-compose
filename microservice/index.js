#!/usr/bin/env node
const yahooFinance = require('yahoo-finance');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const {createOrUpdateStock} = require('./app/controllers/cities');

const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:20017/sub-dev';

mongoose.connect(dbURL, {useMongoClient: true});

const stocks = [
    //{city: 'Bordeaux', indice: 'ACA.PA'},
    //{city: 'Lille', indice: 'FP.PA'},
    //{city: 'Lyon', indice: 'CS.PA'},
    //{city: 'Marseille', indice: 'GLE.PA'},
    //{city: 'Nantes', indice: 'CA.PA'},
    {city: 'Paris', indice: 'BNP.PA'},
    //{city: 'Toulouse', indice:'UG.PA'}
];

const getValue = async symbol => {
    const stock = await yahooFinance.quote({
        symbol,
        modules: ['financialData']
    });
    return stock.financialData.currentPrice;
};

const main = async () => {
    const valuesPromises = stocks.map(a => getValue(a.indice));
    const results = await Promise.all(valuesPromises);
    const formattedResults = stocks.map((a, idx) => {
        return {[a.city]: results[idx]};
    });

    stocks.forEach((a, index) => {
         createOrUpdateStock(a.city, results[index])
    });

    console.log(formattedResults);
};

setInterval(main, 5000);
