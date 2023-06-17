'use strict';
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const moment = require('moment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const singularWhatsappSessionManager  = require('./services/whatsappSessionManager');
const qrcode = require('qrcode-terminal');
const {qr, ready, msg} = require('./services/whatsAppService')

process.env.jwt_secret = 'chat3425#$G$#3VBHSJBSJTSDDN4c4cEfFvGggGGf5t3e4Y%G&tg67GUbtfVE345$4#3#$$456&6589citysdbsbjmsdbjb';
process.env.bcrypt_salt = '$2a$06$bghdsSsGHJG3554AaSDSDtrt5g][gff.htfgfh4033xvs5345dfe65456556755sdsd6f7sdfHfgshgfshdfsdh35';

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig['production'])
global.knex = knex;

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

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/*' }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "./client/build/")));

app.use('/api', api);

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
    console.log('restoring previus whatsapp sessions');
   // await singularWhatsappSessionManager.restorePreviousSessions();

    const server = app.listen(app.get('port'), function() {
        console.log('Express server listening on port 3000');
    });

   // singularWhatsappSessionManager.createWAClient('tadiwa',qr,msg, ready);

}).catch((e)=>{
    console.log(e);
    process.exit(1);
});





