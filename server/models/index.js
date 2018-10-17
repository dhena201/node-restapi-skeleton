const Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const _ = require('lodash');

const models = {};
const modelsDir = path.normalize(`${__dirname}`);
const modelPostfix = '.model.js';

// connect to mysql db

const connection = new Sequelize(
    config.mysql.dbMaster,
    config.mysql.user,
    config.mysql.password,
    {
        dialect: 'mysql',
        operatorsAliases: false,
        port: config.mysql.port,
        host: config.mysql.host,
        timezone: '+07:00'
    }
);

// loop through all files in models directory ignoring hidden files and this file
let modelFiles = fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file.indexOf('.map') === -1))

// import model files and save model names
modelFiles.forEach((file) => {
    console.log(`Loading model file ${file}`);
    if (file.includes(modelPostfix)) {
        const model = connection.import(path.join(modelsDir, file));
        models[model.name] = model;
    }
});

// Handle relation between model
Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

// Synchronizing any model changes with database.
if (config.sync === 'true') {
    let alter = {alter: true}
    connection
        .sync()
        .then(() => {
            console.log('Database master synchronized');
        })
        .catch(err => {
            console.log('An error found : %j', err);
        });
}

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
    connection,
    Sequelize,
}, models);

