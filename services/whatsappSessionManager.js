const { readdir } = require("fs/promises");
const { WhatsappWebSession } = require('./whatsappWebSession.js')
const { updateRecord, selectWhere, insertRecord } = require('./generalDbService');
const { v4: uuidv4 } = require('uuid');
const { networkPost } = require("./networkService.js");
var qrcode = require('qrcode-terminal');

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);   

async function qrReceived(qr, clientId) {
  try{ 
    qrcode.generate(qr, function (qrcode) {
      console.log(qrcode);
    });
    updateRecord({metadata:qr, stage:'qr'},'accounts','accountId',clientId);
  }catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}
  
async function clientReady(clientId, client){
  try{
    updateRecord({metadata:'',stage:'complete'},'accounts','accountId',clientId);
  } catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}
  
async function messageReceived(msg, clientid){

  try{
    const account = await selectWhere([{field:'accountId', value:clientid}], 'accounts','*');

    if( account.length < 1){
      return;
    }

    const { metadata, stage, contacts } = account[0]
    const { from, body, client , isStatus, timestamp, to } = msg;

    if(!contacts){
      return;
    }

    if(stage === 'complete'){
      const contact = await JSON.parse(contacts?.filter((c)=> { c.id === from}));

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
  }catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}

async function onAuthenticated(clientId){
  try{
    report.log({ level: 'info', message: `${await dd()} Client: ${clientId} authenticated successfully` });
    updateRecord({metadata:'',stage:'authenticated'},'accounts','accountId',clientId);
  }catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}

async function onAuthFail(clientId, msg){
  try{
    report.log({ level: 'error', message: `${await dd()} Failed to authenticate Client: ${clientId} because : ${msg}` });
    updateRecord({metadata:'',stage:'auth_fail'},'accounts','accountId',clientId);
  }catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}

async function onDisconnect(reason, clientId){
  try{
    report.log({ level: 'error', message: `${await dd()} Client: ${clientId} disconnected because : ${reason}` });
    updateRecord({metadata:'',stage:'disconnected'},'accounts','accountId',clientId);
  }catch(ex){
    report.log({ level: 'error', message: `${await dd()} ${ex}` });
  }
}

class WhatsappSessionManager {
  sessionIdVsClientInstance = [];

  constructor() {
    this.sessionIdVsClientInstance = [];
    return this;
  }

  removeInstance = async (sessionId) => {
    try{
   
      const instances = this.sessionIdVsClientInstance;
      const remainingInstances = await instances.filter((i)=>{ return i.id !== sessionId});
      this.sessionIdVsClientInstance = remainingInstances;

      return true;

    }catch(ex){
      report.log({ level: 'error', message: `apo${await dd()} ${ex}` });
      return null
    }
  }

  getSessionClient  = async (sessionId) => {
    try{
   
      let instances = this.sessionIdVsClientInstance;
      let instance = await instances.filter((i)=>{ return i.id === sessionId});

      if(instance.length > 0){
        instance = instance[0]['instance']?.client
      }else{
        instance = null
      }

      return instance
    }catch(ex){
      report.log({ level: 'error', message: `apo${await dd()} ${ex}` });
      return null
    }
  };

  createWAClient = async (sessionId, proxy, useragent) => {
    try{

      const instance = new WhatsappWebSession( 
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

      this.sessionIdVsClientInstance.push({ 
        id:sessionId,
        instance
      })

      return instance

      }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
      }
  };

  async restorePreviousSessions() {
    try{
      const directoryNames = await getDirectories(
        "./sessions"
      );
      const sessionIds = directoryNames.map(name => name.split("-")[1]);

      sessionIds.forEach(async (sessionId) => {

        if(!sessionId){
          report.log({ level: 'error', message: `${await dd()} could not start session because of Invalid sessionId : ${sessionId}` });
        }else{
          const session = await selectWhere([{field:'accountId', value:sessionId}],'accounts', '*');
          const { ua, proxy } = session;
    
          this.createWAClient(sessionId,proxy, ua);
        }
      });
    }catch(ex){
      report.log({ level: 'error', message: `${await dd()} ${ex}` });
    }
  }
}

const singularWhatsappSessionManager = new WhatsappSessionManager();
module.exports = singularWhatsappSessionManager;
