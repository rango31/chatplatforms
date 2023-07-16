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

        if(acc.length > 0) { 
            return await response(res, `Session ${id} already exists` , false )
        }

        const proxyId = null;
        const ua = await randUserAgent.getRandom();

        await insertRecord(
            { 
                accountId:id,
                service: 'WA',
                stage: 'auth',
                proxyId,
                userAgent: ua
            } ,'accounts');

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
        const client = await singularWhatsappSessionManager.getSessionClient(id);

        const contacts = await client.getContacts();
       //

        return await response(res, contacts, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function getChats(req, res){
    try{
        const id = req.query.id;
        const client = await singularWhatsappSessionManager.getSessionClient(id);
        const chats = await client.getChats();

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

        const client = await singularWhatsappSessionManager.getSessionClient(id);
        const state = await client.getState();

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

        const client = await singularWhatsappSessionManager.getSessionClient(id);

        await client.destroy();

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

        const client = await singularWhatsappSessionManager.getSessionClient(id);
        await client.destroy();
        fs.rmSync(`../sessions/${id}`, { recursive: true, force: true });
        await delRecord('accounts', 'accountId', id);

        report.log({ level: 'warn', message: `${await dd()} Logging out account:${id}` });

        const proxyId = null;
        const ua = await randUserAgent.getRandom();

        await insertRecord(
            { 
                service: 'WA',
                stage: 'auth',
                proxyId,
                userAgent: ua
            } ,'accounts');

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

        const { contacts } = acc[0];

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