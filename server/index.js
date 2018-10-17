'use strict';

const 
    express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    httpStatus = require('http-status'),
    expressWinston = require('express-winston'),
    expressValidation = require('express-validation'),
    helmet = require('helmet'),
    winstonInstance = require('./components/winston'),
    APIError = require('./components/APIError'),
    path = require('path'),
    passport = require('passport'),
    passportConfig = require('./components/passport'),
    actuator = require('express-actuator');

module.exports = function(){
    let server = express(),
        create,
        start;
    
    create = function(config) {
        let router = require('./components/router');

        // Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        if (config.env === 'development') {
            server.use(logger('dev'));
        }
        
        // parse body params and attache them to req.body
        server.use(bodyParser.json({limit: '1024kb'}));
        server.use(bodyParser.urlencoded({limit: '1024kb', extended: true}));
        server.use(bodyParser.raw({
            inflate: true,
            limit: '100kb',
            type: 'application/json'
        }));
        
        server.use(cookieParser());
        server.use(compress());
        server.use(methodOverride());
        
        // secure apps by setting various HTTP headers
        server.use(helmet());
        
        // enable CORS - Cross Origin Resource Sharing
        const corsOptions = {
            origin: true,
            credentials: true,
            exposedHeaders: ['Filename']
        }
        server.use(cors(corsOptions));
        
        //make the project directory static.
        //load the files that are in the public directory from the /files path prefix.
        server.use('/files', express.static(path.resolve(__dirname, '../../public')))
        
        // enable detailed API logging in dev env
        // also detailed API logging in file (.log) non dev env
        expressWinston.requestWhitelist.push('body');
        expressWinston.bodyBlacklist.push('password', 'confirm', 'old_password', 'password_confirm', 'basic_salary', 'token', 'resetToken', 'refreshToken')
        // expressWinston.responseWhitelist.push('body');
        server.use(expressWinston.logger({
            winstonInstance: config.env === 'development' ? winstonInstance.logger : winstonInstance.file('logger'),
            meta: true, // optional: log meta data about request (defaults to true)
            msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
            colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
        }));
        
        
        // set up Passport middleware
        passportConfig(passport, config);
        server.use(passport.initialize());
        
        // set up express actuator
        server.use(actuator('/actuator'));
        
        // init router
        router.init(server);
        
        // if error is not an instanceOf APIError, convert it.
        server.use((err, req, res, next) => {
            if (err instanceof expressValidation.ValidationError) {
                // validation error contains errors which is an array of error each containing message[]
                const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
                const error = new APIError(unifiedErrorMessage, err.status, true);
                return next(error);
            } else if (!(err instanceof APIError)) {
                const apiError = new APIError(err.message, err.status, err.isPublic);
                return next(apiError);
            }
            return next(err);
        });
        
        // catch 404 and forward to error handler
        server.use((req, res, next) => {
            const err = new APIError('API not found', httpStatus.NOT_FOUND, true);
            return next(err);
        });
        
        // log error in winston transports except when executing test suite
        if (config.env === 'development') {
            server.use(expressWinston.errorLogger({winstonInstance: winstonInstance.logger}));
        } else {
            server.use(expressWinston.errorLogger({winstonInstance: winstonInstance.file('error')}));
        }
        
        // error handler, send stacktrace only during development
        server.use((err, req, res, next) => // eslint-disable-line no-unused-vars
            res.status(err.status).json({
                message: err.isPublic ? err.message : httpStatus[err.status],
                stack: config.env === 'development' ? err.stack : {},
            })
        );
    };

    start = function() {
        let hostname = server.get('hostname'),
            port = server.get('port'),
            env = server.get('env');
        server.listen(port, () => {
            console.info(`server listening on - http://${hostname}:${port} (${env})`);
        });
    };

    return {
        create: create,
        start: start
    };
}