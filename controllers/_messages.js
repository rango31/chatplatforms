
const { selectWhere, insertRecord, updateRecord, select } = require('../services/generalDbService');

async function messages(req,res){
    const Messages = await select('messages','*');
    return res.json({
        status: 200,
        success: true,
        data: Messages
    });
}

module.exports = {
    messages
}