'use strict';
const express = require('express');
const router = express.Router();

const { 
    authClient,
    getContacts,
    connectionStatus,
    logout,
    updateContacts,
    savedContacts,
    poll,
    getChats
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
router.get('/getchats', getChats);
router.get('/connectionstatus', connectionStatus);
router.delete('/logout', logout);
router.get('/poll', poll);
router.get('/savedcontacts', savedContacts);
router.put('/updatecontacts', updateContacts);

//proxy routes
router.post('/addproxy',addProxy);
router.put('/updateproxy',updateProxy);
router.delete('/delproxy',delProxy);
router.get('/proxies',proxies);

module.exports = router;