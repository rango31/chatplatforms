const { Client, LocalAuth } = require('whatsapp-web.js');

class WhatsappWebSession {
  constructor(callback, readyCallback,msgCallback, clientId) {

    this.client = new Client({
      puppeteer: {
        headless: false,
        args: [
          '--no-sandbox','--disable-dev-shm-usage'
        ]
      },
      authStrategy: new LocalAuth({
        clientId,
        dataPath: './sessions',
      })
    });

    this.client.on('qr', (qr) => {
      this.qr = qr;
      callback(qr,clientId);
    });
    
    this.client.on('ready', () => {
      console.log('Client is ready!');
      readyCallback(clientId);
    });

    this.client.on('message', (msg) => {
      console.log('msg received');
      msgCallback(msg, clientId);
    });

    this.client.initialize();
  }

  getQr() {
    return this.qr;
  }

  getClient() {
    return this.client;
  }

  async destroy() {
    await this.client.destroy();
  }

  async restart() {
    await this.destroy();
    this.client = new Client();
    this.client.on('qr', (qr) => {
      this.qr = qr;
    });
    this.client.initialize();
  }
}

module.exports = {
  WhatsappWebSession
}