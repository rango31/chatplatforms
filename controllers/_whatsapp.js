const { selectWhere, insertRecord, updateRecord, select } = require('../services/generalDbService');
const singularWhatsappSessionManager = require('../services/whatsappSessionManager');

async function authClient(req,res){
    const id = req.params.id;

    //check if id exists

    await insertRecord({accountId, service:'whatsapp',metadata:'',stage:'qr',userId},'useraccounts');
    await singularWhatsappSessionManager.createWAClient(id);

    //return polling url for qrcode 

    return res.json({
        status: 200,
        success: true,
        data: accountId
    });
}

async function getContacts(req, res){
    const id = req.params.id;
    const client = await singularWhatsappSessionManager.getSessionClient(id);

    res.json(await client.getContacts());
}

async function connectionStatus(req, res){
    const id = req.params.id;
    const client = await singularWhatsappSessionManager.getSessionClient(id);

    res.send(await client.getState());
}

async function logout(req, res) {
    const id = req.params.id;
    const client = singularWhatsappSessionManager.getSessionClient(id);

    await client.destroy();
    //delete files
    //make sure object is closed
}

async function poll(req, res){
    //return metadata field
}

async function updateContacts(req, res){
    const id = req.params.id;
    const contacts = req.body.contacts;

    if(id && contacts){

    }else{
        return 'please Contacts required';
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