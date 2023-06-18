const { readdir } = require("fs/promises");
const { WhatsappWebSession } = require('./whatsappWebSession.js')
const {ready,msg,qr} = require('./whatsAppService.js')

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

class WhatsappSessionManager {
  sessionIdVsClientInstance = {};

  constructor() {
    this.sessionIdVsClientInstance = {};
    return this;
  }

  createWAClient = (sessionId, qrGenerationCallback, msgCallBack,readyInstanceCallback) => {
    console.log('creating account')
    return new WhatsappWebSession(qrGenerationCallback, readyInstanceCallback,msgCallBack,sessionId);
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

  getClientFromSessionId = sessionId => {
    return this.sessionIdVsClientInstance[sessionId];
  };
}

const singularWhatsappSessionManager = new WhatsappSessionManager();
module.exports = singularWhatsappSessionManager;