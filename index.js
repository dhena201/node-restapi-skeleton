const config = require('./config/config');
const server = require('./server/')();
const cluster = require('cluster');
const os = require('os');

//number of CPU Core
let numCPUs = os.cpus().length;

const debug = require('debug')('expressjs_api:index');
/* eslint-enable no-unused-vars */

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

//Implement nodeJs Cluster
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    // numCPUs = numCPUs >= 4 ? (numCPUs-2) : numCPUs
    numCPUs = numCPUs >= 2 ? 2 : numCPUs
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP/S server
    // module.parent check is required to support mocha watch
    if (!module.parent) {
        server.create(config);
        server.start();
    }

    console.log(`Worker ${process.pid} started`);
}

module.exports = server;