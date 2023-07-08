const { readdir } = require("fs/promises");
const { WhatsappWebSession } = require('./whatsappWebSession.js')
const { updateRecord, selectWhere, insertRecord } = require('./generalDbService');
const { v4: uuidv4 } = require('uuid');
const { networkPost } = require("./networkService.js");

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);   

async function qrReceived(qr, clientId) {
  updateRecord({metadata:qr, stage:'qr'},'accounts','accountId',clientId);
}
  
async function clientReady(clientId, client){
    updateRecord({metadata:'',stage:'complete'},'accounts','accountId',clientId);
}
  
async function messageReceived(msg, clientid){
    const account = selectWhere([{field:'accountId', value:clientid}], 'accounts','*');
    const { metadata, stage, contacts } = account[0]
    const { from, body, client , isStatus, timestamp, to } = msg;

    if(stage === 'complete'){
      const contact = await JSON.parse(contacts.filter((c)=> { c.id === from}));

      if(contact.length > 0 && !isStatus){

        const { name, isGroup,  } = contact;

        const message = {
                          meta: {
                            userId: clientid,
                            to: {
                              recipientId: to,
                            },
                            from: {
                              recipientId: from,
                              name,
                              isGroup
                            },
                            timestamp,
                            platform: 'WA'
                          },
                          message: {
                            body
                          }
                       }
          
         //throttling maybe ??
        await networkPost(message, '');

      }
    }
}

async function onAuthenticated(clientId){
  report.log({ level: 'info', message: `${await dd()} Client: ${clientId} authenticated successfully` });
  updateRecord({metadata:'',stage:'authenticated'},'accounts','accountId',clientId);
}

async function onAuthFail(clientId, msg){
  report.log({ level: 'error', message: `${await dd()} Failed to authenticate Client: ${clientId} because : ${msg}` });
  updateRecord({metadata:'',stage:'auth_fail'},'accounts','accountId',clientId);
}

async function onDisconnect(reason, clientId){
  report.log({ level: 'error', message: `${await dd()} Client: ${clientId} disconnected because : ${reason}` });
  updateRecord({metadata:'',stage:'disconnected'},'accounts','accountId',clientId);
}

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
    return new WhatsappWebSession( 
        qrReceived,
        clientReady,
        messageReceived,
        onAuthenticated,
        onAuthFail,
        onDisconnect,
        sessionId,
        proxy,
        useragent 
      );
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
