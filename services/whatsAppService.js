const qrcode = require('qrcode-terminal');
const { updateRecord } = require('./generalDbService');
const singularWhatsappSessionManager = require('./whatsappSessionManager');

function qr(qr, clientId) {
    //qrcode.generate(qr, { small: true }); 
    updateRecord({metadata:qr},'useraccounts','accountId',clientId);
}

function ready(clientId){

    const  contacts = [];
    const client = singularWhatsappSessionManager.getClientFromSessionId(clientId);
    const chats = client.getChats();
    console.log(chats);

    for (const chat of chats) {
        const {id, name, isGroup} = chat;
        contacts.push({id,name})   
    }

    updateRecord({metadata:contacts,stage:'contacts'},'useraccounts','accountId',clientId);
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