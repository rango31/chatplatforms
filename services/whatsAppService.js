const qrcode = require('qrcode-terminal');

function qr(qr) {
    qrcode.generate(qr, { small: true }); 
}

function ready(){
    console.log('app is ready')
}

function msg(msg, clientid){
    console.log({
        'From':msg.from,
        'Body':msg.body,
        'client': clientid
    })
}