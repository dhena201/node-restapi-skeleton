'use strict';
const fs = require('fs');

function init(server){
    const baseRoute = '/api/';
    // Getting an Array of the files in the 'controllers' folder.
    let files = fs.readdirSync( __dirname + '/../routes/');
    files.forEach( fileName => {
        // Stripping the filename from the extension and storing it for later use
        // as the Controller name.
        let contName = /.+(?=\.\w?)/.exec(fileName)[0];

        // Create a new object to hold the controllers,
        // I use an Object because that helps me with dynamic variables.
        let controllers = {};

        // Store the required module in a variable.
        controllers[contName] = require( __dirname + '/../routes/' + fileName );


        // Setting the route string.
        let route;

        // If file is the index file, the route should be '/'
        if (fileName === 'index.js') {
            route = baseRoute;
        } else {
            // Get filename without extension using regex
            route = baseRoute + contName;
        }

        server.use(route, controllers[contName]);
    });

    server.get('/', function (req, res) {
        res.redirect(baseRoute);
    });
}


module.exports = {
    init:init
};