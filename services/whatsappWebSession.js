const { Client, LocalAuth } = require('whatsapp-web.js');

class WhatsappWebSession {
  
  constructor ( 
    qrCallback,
    readyCallback,
    msgCallback,
    authCallback,
    authFailCallback,
    disconnectCallback,
    clientId,
    proxy,
    useragent
    ) {

    proxy = proxy ? `--proxy-server=${proxy}` : '';

    this.client = new Client({
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox','--disable-dev-shm-usage','--disabled-setupid-sandbox',proxy
        ]
      },
      authStrategy: new LocalAuth({
        clientId,
        dataPath: './sessions',
      })
    });

    // this.client.options.userAgent = useragent;

    this.client.on('qr', (qr) => {
      this.qr = qr;
      qrCallback(qr,clientId);
    });
    
    this.client.on('ready', () => {
      readyCallback(clientId, this.client);
    });

    this.client.on('message', (msg) => {
      msgCallback(msg, clientId);
    });

    this.client.on('auth_failure', (error) => {
     authFailCallback(error, clientId)
    });

    this.client.on('authenticated', () => {
      authCallback(clientId)
     });

     this.client.on('change_state', async (state) => {
      report.log({ level: 'warn', message: `${ dd()} Client: ${clientId} state changed to: ${state}` });
     });

    this.client.on('disconnected', (reason) => {
      disconnectCallback(reason, clientId)
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