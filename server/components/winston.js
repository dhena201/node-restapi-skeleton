const winston = require('winston');
const wcf = require('winston-console-formatter');
const path = require('path');
const moment = require('moment');
const _util = require('util');

require('winston-daily-rotate-file')

const {formatter} = wcf();
const tsFormat = () => moment().format('YYYY-MM-DD HH:mm:ss').trim();

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            formatter,
            timestamp: tsFormat,
        }),
    ],
});

const log = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            json: false,
            colorize: true,
            prettyPrint: true,
            timestamp: tsFormat
        }),
    ],
});

const file = (filename = '') => {
    return new (winston.Logger)({
        transports: [
            new (winston.transports.DailyRotateFile)({
                filename: path.resolve('./log') + `/app-cfo-${filename}-%DATE%.log`,
                datePattern: 'DD-MM-YYYY',
                handleExceptions: true,
                exitOnError: false,
                timestamp: tsFormat,
                level: 'info',
                maxSize: '5m',
                maxFiles: '7d'
            }),
        ],
    });
}

function formatArgs(args) {
    return [_util.format.apply(_util.format, Array.prototype.slice.call(args))];
}

// Override the built-in console methods with winston hooks
console.log = function () {
    log.info.apply(logger, arguments);
};
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments));
};

module.exports = {file, logger};
