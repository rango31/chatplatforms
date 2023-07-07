const { readdir } = require("fs/promises");
const { WhatsappWebSession } = require('./whatsappWebSession.js')
const { updateRecord, selectWhere, insertRecord } = require('./generalDbService');
const { v4: uuidv4 } = require('uuid');

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

///////Events//////////////////////////////    

async function qrReceived(qr, clientId) {
  updateRecord({metadata:qr},'useraccounts','accountId',clientId);
}
  
async function clientReady(clientId, client){

    const  contacts = [];

    const chats = await client.getContacts();

    for (const chat of chats) {
        let {id, name, isGroup} = chat;
        if(isGroup){
          id= name;
        }else{
          id = chat.id._serialized
        }

        contacts.push({ id, name, isGroup })   
    }

    console.log('contacts updated')
    updateRecord({metadata:await JSON.stringify(contacts),stage:'contacts'},'useraccounts','accountId',clientId);
    
}
  
async function messageReceived(msg, clientid){
    const account = selectWhere('accountId',clientid, 'useraccounts','*');
    const { metadata, stage } = account
    const { from, body, client } = msg;

    if(stage === 'complete'){
      const contacts = JSON.parse(metadata);
      const s = contacts.filter((c)=> { c.id === from});

      if(s.length > 0){
         insertRecord({message: body, messageId:uuidv4(), from,accountId:clientid, DateReceived:Date.now()}, 'messages')
      }
    }
}

async function onAuthenticated(clientId){}

async function onAuthFail(clientId, msg){}

async function onDisconnect(reason, clientId){}


class WhatsappSessionManager {
  sessionIdVsClientInstance = {};

  constructor() {
    this.sessionIdVsClientInstance = {};
    return this;
  }

  getSessionClient  = (sessionId) => {
    return this.sessionIdVsClientInstance[sessionId];
  };

  createWAClient = (sessionId, proxy, useragent) => {
    //generate random user agent
    return new WhatsappWebSession( qrReceived, clientReady, messageReceived, sessionId, proxy, useragent );
  };

  async restorePreviousSessions() {
    const directoryNames = await getDirectories(
      "./sessions"
    );
    const sessionIds = directoryNames.map(name => name.split("-")[1]);

    sessionIds.forEach((sessionId) => {
      //get client proxy and useragent
      this.createWAClient(sessionId, '', '');
    });
  }
}

const singularWhatsappSessionManager = new WhatsappSessionManager();
module.exports = singularWhatsappSessionManager;
