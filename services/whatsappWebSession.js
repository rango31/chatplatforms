const { Client, LocalAuth } = require('whatsapp-web.js');

class WhatsappWebSession {
  constructor(callback, readyCallback,msgCallback, clientId) {

    this.client = new Client({
      puppeteer: {
        headless: false,
        args: [
          '--no-sandbox','--disable-dev-shm-usage','--proxy-server=23.23.23.23'
        ]
      },
      authStrategy: new LocalAuth({
        clientId,
        dataPath: './sessions',
      })
    });

    //this.client.options.userAgent = ''

    this.client.on('qr', (qr) => {
      this.qr = qr;
      callback(qr,clientId);
    });
    
    this.client.on('ready', () => {
      console.log('Client is ready!');
      readyCallback(clientId, this.client);
    });

    this.client.on('message', (msg) => {
      console.log('msg received');
      msgCallback(msg, clientId);
    });

    
    //Emitted when there has been an error while trying to restore an existing session
    this.client.on('auth_failure', (error) => {
     // callback(qr,clientId);
    });

    //Emitted when authentication is successful
    this.client.on('authenticated', () => {
      // callback(qr,clientId);
     });

     // Emitted when the connection state changes
     this.client.on('change_state', (state) => {
      // callback(qr,clientId);
     });

      // Emitted when the client has been disconnected
    this.client.on('disconnected', (reason) => {
      //could be reason/ WASTATE
      // callback(qr,clientId);
    });

    this.client.on('incoming_call', (call) => {
      // callback(qr,clientId);
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