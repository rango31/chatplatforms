'use strict';
const express = require('express');
const router = express.Router();

const { 
    authClient,
    getContacts,
    connectionStatus,
    logout,
    updateContacts
 } = require('../controllers/_whatsapp.js');

router.post('/authclient', authClient);
router.get('/getcontacts', getContacts);
router.get('/connectionstatus', connectionStatus);
router.get('/logout', logout);
router.put('/updatecontacts', updateContacts);

module.exports = router;