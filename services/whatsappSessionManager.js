const { readdir } = require("fs/promises");
const { WhatsappWebSession } = require('./whatsappWebSession.js')
const { updateRecord, selectWhere, insertRecord } = require('./generalDbService');
const { v4: uuidv4 } = require('uuid');

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

function qr(qr, clientId) {
  updateRecord({metadata:qr},'useraccounts','accountId',clientId);
}
  
async function ready(clientId, client){

    const  contacts = [];

    const chats = await client.getChats();

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
  
function msg(msg, clientid){
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

class WhatsappSessionManager {
  sessionIdVsClientInstance = {};

  constructor() {
    this.sessionIdVsClientInstance = {};
    return this;
  }

  getSessionClient  = (sessionId) => {
    return this.sessionIdVsClientInstance[sessionId];
  };

  createWAClient = (sessionId) => {
    return new WhatsappWebSession(qr, ready,msg,sessionId);
  };

  async restorePreviousSessions() {
    const directoryNames = await getDirectories(
      "./sessions"
    );
    const sessionIds = directoryNames.map(name => name.split("-")[1]);

    sessionIds.forEach(sessionId => {
      this.createWAClient(sessionId,qr,msg,ready);
    });
  }
}

const singularWhatsappSessionManager = new WhatsappSessionManager();
module.exports = singularWhatsappSessionManager;

/*PRIVATE CHAT
  PrivateChat {
    id: {
      server: 'c.us',
      user: '263773017447',
      _serialized: '263773017447@c.us'
    },
    name: 'Tatenda Tyrs',
    isGroup: false,
    isReadOnly: undefined,
    unreadCount: 0,
    timestamp: 1686032020,
    archived: undefined,
    pinned: false,
    isMuted: false,
    muteExpiration: 0,
    lastMessage: Message {
      _data: [Object],
      mediaKey: undefined,
      id: [Object],
      ack: 0,
      hasMedia: false,
      body: 'Lazy man',
      type: 'chat',
      timestamp: 1686032020,
      from: '263773017447@c.us',
      to: '263777939353@c.us',
      author: undefined,
      deviceType: 'android',
      isForwarded: false,
      forwardingScore: 0,
      isStatus: false,
      isStarred: false,
      broadcast: false,
      fromMe: false,
      hasQuotedMsg: false,
      hasReaction: false,
      duration: undefined,
      location: undefined,
      vCards: [],
      inviteV4: undefined,
      mentionedIds: [],
      orderId: undefined,
      token: undefined,
      isGif: false,
      isEphemeral: undefined,
      links: []
    }
  },

   GroupChat {
    groupMetadata: {
      id: [Object],
      creation: 1581440823,
      owner: [Object],
      subject: 'YMCMB😅',
      restrict: false,
      announce: false,
      noFrequentlyForwarded: false,
      ephemeralDuration: 0,
      membershipApprovalMode: false,
      support: false,
      suspended: false,
      terminated: false,
      uniqueShortNameMap: {},
      isLidAddressingMode: false,
      isParentGroup: false,
      isParentGroupClosed: false,
      defaultSubgroup: false,
      allowNonAdminSubGroupCreation: false,
      incognito: false,
      participants: [Array],
      pendingParticipants: [],
      pastParticipants: [],
      membershipApprovalRequests: [],
      subgroupSuggestions: []
    },
    id: {
      server: 'g.us',
      user: '263783376165-1581440823',
      _serialized: '263783376165-1581440823@g.us'
    },
    name: 'YMCMB😅',
    isGroup: true,
    isReadOnly: undefined,
    unreadCount: 0,
    timestamp: 1686135803,
    archived: undefined,
    pinned: false,
    isMuted: false,
    muteExpiration: 0,
    lastMessage: Message {
      _data: [Object],
      mediaKey: undefined,
      id: [Object],
      ack: 2,
      hasMedia: false,
      body: 'Vanhu vari serious',
      type: 'chat',
      timestamp: 1686135803,
      from: '263777939353@c.us',
      to: '263783376165-1581440823@g.us',
      author: '263777939353@c.us',
      deviceType: 'ios',
      isForwarded: undefined,
      forwardingScore: 0,
      isStatus: false,
      isStarred: false,
      broadcast: undefined,
      fromMe: true,
      hasQuotedMsg: true,
      hasReaction: false,
      duration: undefined,
      location: undefined,
      vCards: [],
      inviteV4: undefined,
      mentionedIds: [],
      orderId: undefined,
      token: undefined,
      isGif: false,
      isEphemeral: undefined,
      links: []
    }
  },
  
*/