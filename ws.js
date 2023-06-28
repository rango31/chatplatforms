const jwt = require('jsonwebtoken');

const singularWhatsappSessionManager  = require('./services/whatsappSessionManager');

const io = require("socket.io")({
    origins: ["*:*"],
    cors:true,
    allowEIO3: true
});

let clients = [];

io.use(async function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        
    await jwt.verify(socket.handshake.query.token, process.env.jwt_secret, 
        async function(err, decoded) {
            if (err) {
            return next(new Error('Authentication error'));
            }

            decoded.from = socket.handshake.query.from;
            socket.decoded = decoded;
            next();
        });
    }
    else {
    next(new Error('Authentication error'));
    }    
})


io.on('connection', async client => {

    let socket = client.decoded;
    socket.client = client;

    clients = await clients.filter(s => s.id !== socket.id );
    clients.push(socket);
    
    client.on('checkstatus',async function( message ) {
        //client check status
    });

    client.on('disconnect', () => { 
        clients = clients.filter(s => s.id !== socket.id);
        console.log(`connected clients (clientdisconnected) : ${clients.length}`);
    });
});

io.listen(3001);