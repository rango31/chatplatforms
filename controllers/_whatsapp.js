const { selectWhere, insertRecord, updateRecord, select } = require('../services/generalDbService');
const singularWhatsappSessionManager = require('../services/whatsappSessionManager');
const randUserAgent = require('random-useragent');
const { response } = require('../services/helpersService');

async function authClient(req,res){
    const id = req.query.id;

    const acc = await selectWhere([{field:'accountId', value: id}],'accounts','*');

    if(acc.length > 0) { 
        return await response(res, `Account ${id} already exists` , false )
    }

    const proxyId = '';
    const ua = await randUserAgent.getRandom();

    await insertRecord(
        { 
            service: 'whatsapp',
            stage: 'auth',
            proxyId,
            userAgent: ua
        } ,'accounts');

    await singularWhatsappSessionManager.createWAClient(id, '',ua);

    return await response(res, `Account authentication initiated` , 200 )
}

async function getContacts(req, res){
    try{
        const id = req.query.id;
        const client = await singularWhatsappSessionManager.getSessionClient(id);
        const contacts = await client.getContacts();

        return await response(res, contacts, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function connectionStatus(req, res){
    try{
        const id = req.params.id;
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
        const id = req.params.id;
        const client = await singularWhatsappSessionManager.getSessionClient(id);

        await client.destroy();
        //delete files
        //make sure object is closed
        report.log({ level: 'error', message: `${await dd()} Logging out account ${id}` });
        return await response(res, `Client closed`, true )
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function poll(req, res){
    try{
        const id = req.query.id;

        if(!id) { 
            return await response(res, `Please provide a valid account Id` , false )
        }

        const account = await selectWhere([{field:'accountId',value:id}], 'accounts', 'accountId, metadata, stage, updatedAt');

        if(account.length < 1){
            return await response(res, `Account not found` , false )
        }

        return await response(res, account[0] , false )


    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

async function updateContacts(req, res){
    try{
        const id = req.query.id;
        const contacts = req.body.contacts;

        if(id && contacts){
            const result = await updateRecord(contacts, 'accounts', 'accountId', id);
            return await response(res, `Contacts updated`, true );

        }else{
            return response(res, `Please provide contacts object ` , false );
        }

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }

}

async function restartClient(req, res) {
    
    try{
        const id = req.query.id;

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false );
    }
}

module.exports = {
    authClient,
    getContacts,
    connectionStatus,
    poll,
    updateContacts,
    logout
}