const axios = require('axios');

const networkPost  = async ( data, endpoint) => {
    try {
        const response = await axios.post(endpoint,data);
        console.log(response);
        return response;
    } catch (ex) {
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return null
    }
}

const networkGet = async ( endpoint ) => {
    try {
        const response = await axios.get(endpoint,);
        return response;
    } catch (ex) {
        report.log({ level: 'error', message: `${await dd()} ${ex}` });
        return null
    }
}

module.exports = {
    networkPost,
    networkGet
}