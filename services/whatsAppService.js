const qrcode = require('qrcode-terminal');
const { updateRecord } = require('./generalDbService');

function qr(qr, clientId) {
    //qrcode.generate(qr, { small: true }); 
    updateRecord({metadata:qr},'useraccounts','accountId',clientId);
}

function ready(clientId){
    console.log('app is ready doe client ', clientId)
}

function msg(msg, clientid){
    console.log({
        'From':msg.from,
        'Body':msg.body,
        'client': clientid
    })
}

module.exports = {
    msg,
    ready,
    qr
}