'use strict';
const express = require('express');
const router = express.Router();

const { checkToken , login, users,register} = require('../controllers/_auth.js');
const { messages } = require('../controllers/_messages.js');
const { startLogin, getData } = require('../controllers/_whatsapp.js');

router.use(checkToken);
//auth
router.post('/login', login);
router.post('/register', register);
router.get('/users', users);

//messages
router.get('/messages', messages);

//useraccounts
router.get('/startlogin', startLogin);
router.post('/getdata', getData);

module.exports = router;
