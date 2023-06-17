'use strict';
const express = require('express');
const router = express.Router();

const { checkToken , login, users} = require('../controllers/_auth.js');

//auth
router.post('/login', login);
router.post('/register', users);
router.get('/users', users);

module.exports = router;
