'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express')
const swaggerAutogen = require('swagger-autogen')()
const sf = require('./swagger_output.json');
var fs = require('fs');

const singularWhatsappSessionManager  = require('./services/whatsappSessionManager');
const { dd } = require('./services/helpersService');

process.env.jwt_secret = 'chat3425#$G$#3VBHSJBSJTSDDN4c4cEfFvGggGGf5t3e4Y%G&tg67GUbtfVE345$4#3#$$456&6589citysdbsbjmsdbjb';
process.env.bcrypt_salt = '$2a$06$bghdsSsGHJG3554AaSDSDtrt5g][gff.htfgfh4033xvs5345dfe65456556755sdsd6f7sdfHfgshgfshdfsdh35';
process.env.env = 'development';

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig['development'])
global.knex = knex;
global.dd = dd;

global.report = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    // defaultMeta: { System: 'LocalyserScrapper'},
    transports: [
      new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
    ],
});

report.add(new winston.transports.Console({ format: winston.format.simple() }));

const api = require('./routes/api');

const app = express();

app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    }
})); 

app.use(cors());
app.use(helmet());

app.disable('x-powered-by');

app.use(async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/*' }))

app.use('/api', api);
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(sf))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

app.set('port', process.env.PORT || 3000);

knex.migrate.latest()
    .then(async () => {

        if (!fs.existsSync('./sessions')){
            report.log({ level: 'info', message: `${await dd()} Sessions Folder not found, creating it...` });
            fs.mkdirSync('./sessions');
        }

        report.log({ level: 'info', message: `${await dd()} Restoring previous Chat Sessions...` });
        //singularWhatsappSessionManager.restorePreviousSessions();

        report.log({ level: 'info', message: `${await dd()} Setting up swagger docs. You can access them at http://localhost:3000/documentation/` });
        swaggerAutogen('./swagger_output.json', ['./routes/api.js'])

        report.log({ level: 'info', message: `${await dd()} Starting API server, Chat sessions might not be ready at this time...` });
        app.listen(app.get('port'), async function() {
            report.log({ level: 'info', message: `${await dd()} Chat Server running on Port 3000` });
        });

    }).catch(async (e)=>{
        report.log({ level: 'error', message: `${await dd()} ${e}` });
        //process.exit(1);
    });





