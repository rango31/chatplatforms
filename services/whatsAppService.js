const qrcode = require('qrcode-terminal');
const { updateRecord } = require('./generalDbService');
const { getTheClient } = require('./whatsappSessionManager');

function qr(qr, clientId) {
    //qrcode.generate(qr, { small: true }); 
    updateRecord({metadata:qr},'useraccounts','accountId',clientId);
}

function clientReady(clientId){

    const  contacts = [];
    const client = getTheClient(clientId);

    console.log(client)
   /*
    const chats = client.getChats();
    console.log(chats);

    for (const chat of chats) {
        const {id, name, isGroup} = chat;
        contacts.push({id,name})   
    }

    console.log('contacts updated')
    updateRecord({metadata:contacts,stage:'contacts'},'useraccounts','accountId',clientId);
    */
}

function msg(msg, clientid){
   /* console.log({
        'From':msg.from,
        'Body':msg.body,
        'client': clientid
   })
   */
}

function disconnected(msg, clientid) {

}

module.exports = {
    msg,
    ready,
    qr, 

}