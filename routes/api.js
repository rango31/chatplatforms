'use strict';
const express = require('express');
const router = express.Router();

const { 
    authClient,
    getContacts,
    connectionStatus,
    logout,
    updateContacts,
    savedContacts
 } = require('../controllers/_whatsapp.js');

 const { 
    addProxy,
    updateProxy,
    delProxy,
    proxies
 } = require('../controllers/_proxies.js')

//whatsapp routes
router.post('/authclient', authClient);
router.get('/getcontacts', getContacts);
router.get('/connectionstatus', connectionStatus);
router.get('/logout', logout);
router.get('/savedcontacts', savedContacts);
router.put('/updatecontacts', updateContacts);

//proxy routes
router.post('/addproxy',addProxy);
router.put('/updateproxy',updateProxy);
router.delete('/delproxy',delProxy);
router.get('/proxies',proxies);

module.exports = router;