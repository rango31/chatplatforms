const moment = require('moment');

const authenticateproxy = async (page, username, password) => {
    await page.authenticate({
      username,
      password
    });
  };
  
  const dd = () => moment().format('DD/MM/YYYY-HH:mm:ss');

  const response= (res, data, status) =>{
    return res.json({
              status,
              data
          })
}

  module.exports = {
    dd,
    authenticateproxy,
    response
  }