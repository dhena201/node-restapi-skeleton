const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    PORT: Joi.number()
        .default(3000),
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    JWT_TTL: Joi.number()
        .default(3600),
    DB_MASTER_NAME: Joi.string().required()
        .description('Mysql database name'),
    DB_TRANSACTION_NAME: Joi.string().required()
        .description('Mysql database name'),
    DB_PORT: Joi.number()
        .default(3306),
    DB_HOST: Joi.string()
        .default('localhost'),
    DB_USER: Joi.string().required()
        .description('Mysql username'),
    DB_PASSWORD: Joi.string().allow('')
        .description('Mysql password'),
    DB_SYNC: Joi.string()
        .allow(['true', 'false'])
        .default('false'),
    UPLOAD_PATH: Joi.string()
        .default('public/tmp/'),
    MAILER_EMAIL_ID: Joi.string().allow(''),
    MAILER_PASSWORD: Joi.string().allow(''),
    MAILER_SERVICE_PROVIDER: Joi.any().valid(
        '126',
        '163',
        '1und1',
        'AOL',
        'DebugMail',
        'DynectEmail',
        'FastMail',
        'GandiMail',
        'Gmail',
        'Godaddy',
        'GodaddyAsia',
        'GodaddyEurope',
        'hot.ee',
        'Hotmail',
        'iCloud',
        'mail.ee',
        'Mail.ru',
        'Maildev',
        'Mailgun',
        'Mailjet',
        'Mailosaur',
        'Mandrill',
        'Naver',
        'OpenMailBox',
        'Outlook365',
        'Postmark',
        'QQ',
        'QQex',
        'SendCloud',
        'SendGrid',
        'SendinBlue',
        'SendPulse',
        'SES',
        'SES-US-EAST-1',
        'SES-US-WEST-2',
        'SES-EU-WEST-1',
        'Sparkpost',
        'Yahoo',
        'Yandex',
        'Zoho',
        'qiye.aliyun'
    ).allow('')

}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_TTL,
    hostname: envVars.HOSTNAME,
    mysql: {
        dbMaster: envVars.DB_MASTER_NAME,
        dbTransaction: envVars.DB_TRANSACTION_NAME,
        port: envVars.DB_PORT,
        host: envVars.DB_HOST,
        user: envVars.DB_USER,
        password: envVars.DB_PASSWORD,
    },
    sync: envVars.DB_SYNC,
    upload_path: envVars.UPLOAD_PATH,
    mailer: {
        user: envVars.MAILER_EMAIL_ID,
        password: envVars.MAILER_PASSWORD,
        service: envVars.MAILER_SERVICE_PROVIDER
    },
    docotel: {
        db: envVars.DOCOTEL_DB,
        user: envVars.DOCOTEL_USER,
        password: envVars.DOCOTEL_PASSWORD,
        host: envVars.DOCOTEL_HOST,
        port: envVars.DOCOTEL_PORT
    }
};

module.exports = config;