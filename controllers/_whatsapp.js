const { selectWhere, insertRecord, updateRecord, select } = require('../services/generalDbService');
const { v4: uuidv4 } = require('uuid');
const singularWhatsappSessionManager = require('../services/whatsappSessionManager');
const { qr, ready, msg } = require('../services/whatsAppService');

async function startLogin(req,res){
    const accountId = await uuidv4();
    const userId = req.decoded.userId;

    await insertRecord({accountId, service:'whatsapp',metadata:'',stage:'qr',userId},'useraccounts');
    await singularWhatsappSessionManager.createWAClient(accountId, qr, msg,ready);

    return res.json({
        status: 200,
        success: true,
        data: accountId
    });
}

async function getData(req,res){
    const accountId = req.body.accountid;
    const data = await selectWhere('accountId', accountId, 'useraccounts', ['metadata','stage','accountId']) 
   
    return res.json({
        status: 200,
        success: true,
        data: data
    });
}

module.exports = {
    startLogin,
    getData
}