const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const routes = require('../server/route');
const config = require('./config');
const APIError = require('../server/components/APIError');
const path = require('path');
const passport = require('passport');
const passportConfig = require('./passport');
const actuator = require('express-actuator');

const app = express();

if (config.env === 'development') {
    app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({limit: '1024kb'}));
app.use(bodyParser.urlencoded({limit: '1024kb', extended: true}));
app.use(bodyParser.raw({
    inflate: true,
    limit: '100kb',
    type: 'application/json'
}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: ['Filename']
}
app.use(cors(corsOptions));

//make the project directory static.
//load the files that are in the public directory from the /files path prefix.
app.use('/files', express.static(path.resolve(__dirname, '../../public')))

// enable detailed API logging in dev env
// also detailed API logging in file (.log) non dev env
expressWinston.requestWhitelist.push('body');
expressWinston.bodyBlacklist.push('password', 'confirm', 'old_password', 'password_confirm', 'basic_salary', 'token', 'resetToken', 'refreshToken')
// expressWinston.responseWhitelist.push('body');
app.use(expressWinston.logger({
    winstonInstance: config.env === 'development' ? winstonInstance.logger : winstonInstance.file('logger'),
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
}));


// set up Passport middleware
passportConfig(passport);
app.use(passport.initialize());

// set up express actuator
app.use(actuator('/actuator'));

// mount all routes on /api path
app.use('/api/', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
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
app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND, true);
    return next(err);
});

// log error in winston transports except when executing test suite
if (config.env === 'development') {
    app.use(expressWinston.errorLogger({winstonInstance: winstonInstance.logger}));
} else {
    app.use(expressWinston.errorLogger({winstonInstance: winstonInstance.file('error')}));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {},
    })
);

module.exports = app;
