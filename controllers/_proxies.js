const { insertRecord, updateRecord, select, delRecord } = require('../services/generalDbService');
const { response } = require('../services/helpersService');

async function addProxy(req, res ){
    try {
        const { url, username, password } = req.body;

        if(!url || !username || !password){
            return response(res, `Please provide all required fields` , false );
        }

        req.body.status = 'active';

        const result = await insertRecord(req.body, 'proxies');

        if(result){
            return response(res, `Proxy ${url} added with username ${username}`,true);
        }else{
            return response(res, `Failed to add proxy` , false )
        }
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `Internal server error` , false )
    }
}

async function updateProxy(req, res ){
    try{
        const data = req.body;
        const id = req.query.proxyid;

        if(!id){
            return response(res, `Please provide a valid proxy Id` , false );
        }

        const result = await updateRecord( data, 'proxies', 'proxyId', id);

        if(result){
        return response(res, `Proxy updated`,true);
        }else{
            return response(res, `Failed to update proxy` , false )
        }
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `Internal server error` , false )
    }
}

async function delProxy(req, res ){
    try{
        const id = req.query.proxyid

        if(!id){
            return response(res, `Please provide a valid proxy Id` , false );
        }

        const result = await delRecord('proxies', 'proxyId', id);

        if(result){
            return response(res, `Proxy Deleted`,true);
        }else{
            return response(res, `Failed to delete proxy` , false )
        }

    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `Internal server error` , false )
    }

}

async function proxies(req, res ){
    try{
        return response(res,  await select( 'proxies', '*' ) , 'true')
    }catch(ex){
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return response(res, `A server error occured` , false )
    }
}

module.exports = {
    addProxy, 
    updateProxy,
    delProxy,
    proxies
}