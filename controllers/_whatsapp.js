const { selectWhere, insertRecord, updateRecord, select, delRecord } = require('../services/generalDbService');
const singularWhatsappSessionManager = require('../services/whatsappSessionManager');
const randUserAgent = require('random-useragent');
const fs = require('fs');
const { response } = require('../services/helpersService');

async function authClient(req,res){
    try{
        const id = req.query.id;

        if(!id){
            return await response(res, `Invalid Session Id` , false );
        }

        const acc = await selectWhere([{field:'accountId', value: id}],'accounts','*');
        const dir = `./sessions/session-${id}`

        let proxyId;
        let ua;

        if(acc.length > 0 && fs.existsSync(dir)) { 
            return await response(res, `Session ${id} already exists. If you are having issues with your account, you can reconnect.` , false )
        }

        if(!fs.existsSync(dir) && acc.length > 0){
            await updateRecord({ stage: 'auth'},'accounts', 'accountId', id);
        }else{
            proxyId = null;
            ua = await randUserAgent.getRandom();
            await insertRecord(
                { 
                    accountId:id,
                    service: 'WA',
                    stage: 'auth',
                    proxyId,
                    userAgent: ua
                } ,'accounts');
        }

        singularWhatsappSessionManager.createWAClient( id, null, ua );

        return await response(res, `Account authentication initiated` , true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false )
    }
}

async function getContacts(req, res){
    try{
        const id = req.query.id;

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        if(!client){
            return await response(res, `Client with that Id was not found` , false )
        }

        const contacts = await client?.getContacts();

        return await response(res, contacts, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function getChats(req, res){
    try{
        const id = req.query.id;

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        if(!client){
            return await response(res, `Client with that Id was not found` , false )
        }

        const chats = await client?.getChats();

        return await response(res, chats, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function connectionStatus(req, res){
    try{
        const id = req.query.id;

        if(!id) { 
            return await response(res, `Invalid Session: ${id}` , false )
        }

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        if(!client){
            return await response(res, `Client with that Id was not found` , false )
        }

        const state = await client?.getState();

        return await response(res, state, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function logout(req, res) {
    try{
        const id = req.query.id;

        if(!id) { 
            return await response(res, `Invalid Session: ${id}` , false )
        }
        
        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        const { stage } = account[0];

        if(stage !== 'complete' && stage !== 'disconnected'){
            return await response(res, `Client: ${id} not ready, Please try again in a few minutes` , false )
        }

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        if(!client){
            return await response(res, `Client with that Id was not found` , false )
        }

        await singularWhatsappSessionManager.removeInstance(id);

        try{
            await client?.logout();
            await client?.destroy();
        }catch(ex){
           report.log({ level: 'warn', message: `${await dd()} Could not connect to client because: ${ex.message}` });
        }

        fs.rmSync(`./sessions/session-${id}`, { recursive: true, force: true });

        await delRecord('accounts', 'accountId', id);

        report.log({ level: 'warn', message: `${await dd()} Logged out of Account ${id}` });
        return await response(res, `Client Removed`, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function poll(req, res){
    try{
        const id = req.query.id;

        if(!id) { 
            return await response(res, `Invalid Session Id` , false );
        }

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        return await response(res, account[0] , true )

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function updateContacts(req, res){
    try{
        const id = req.query.id;
        const contacts = req.body.contacts;

        //check if string;

        if(id && contacts){
            const result = await updateRecord({'contacts' : contacts}, 'accounts', 'accountId', id);
            return await response(res, `Contacts updated`, true );

        }else{
            return response(res, `Please check your id and provided contacts` , false );
        }

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }

}

async function reconnectClient(req, res) {

    try{
        const id = req.query.id;

        if(!id) { 
            return await response(res, `Invalid Session: ${id}` , false )
        }

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', ['accountId',' metadata','stage', 'updatedAt']);

        if(account.length < 1){
            return await response(res, `No session found with ID: ${id}` , false )
        }

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        if(!client){
            return await response(res, `Client with that Id was not found` , false )
        }

        await singularWhatsappSessionManager.removeInstance(id);

        try{
            await client?.logout();
            await client?.destroy();
        }catch(ex){
           report.log({ level: 'warn', message: `${await dd()} Could not connect to client because: ${ex.message}` });
        }

        fs.rmSync(`./sessions/${id}`, { recursive: true, force: true });
        await delRecord('accounts', 'accountId', id);

        report.log({ level: 'warn', message: `${await dd()} Logging out account:${id}` });

        const proxyId = null;
        const ua = await randUserAgent.getRandom();

        const result = await insertRecord(
            { 
                accountId:id,
                service: 'WA',
                stage: 'auth',
                proxyId,
                userAgent: ua
            } ,'accounts');

        if(!result){
            return await response(res, `An error occured whilst creating client, Please Auth client to continue` , true )
        }

        await singularWhatsappSessionManager.createWAClient( id, null, ua );

        return await response(res, `Account authentication initiated` , true )

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function savedContacts(req, res) {
    try{
        const id = req.query.id;

        if(!id){
            return await response(res, `Invalid Session Id` , false );
        }

        const acc = await selectWhere([{field:'accountId', value: id}],'accounts','*');

        if(acc.length < 1) { 
            return await response(res, `No session found with ID: ${id}` , false )
        }

        let { contacts } = acc[0];

        if(!contacts){
          contacts = "[]";
        }

        return await response( res, await JSON.parse(contacts) , true )

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false )
    }
}

module.exports = {
    authClient,
    getContacts,
    getChats,
    connectionStatus,
    poll,
    updateContacts,
    logout,
    reconnectClient,
    savedContacts
}