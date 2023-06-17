const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {  getUserByLogin, getToken, generateOTP } = require('../services/userService');
const { selectWhere, insertRecord, updateRecord, select } = require('../services/generalDbService');

async function login(req, res) {

    let {email , password} = req.body;

    if (email && password) {
        password = bcrypt.hashSync(password, process.env.bcrypt_salt);

        let users = await getUserByLogin( email, password);

        if (users.length > 0) {

           const user = {} = await JSON.parse(await JSON.stringify(users[0]));
           const token = await getToken(user);

            return res.json({
                status: 200,
                success: true,
                message: 'Login Successful',
                token,
                user,
            });
        } else {
            return res.json({
                status: 401,
                success: false,
                message: 'Login Failed'
            });
        }
    } else {
        return res.json({
            status: 400,
            success: false,
            message: 'Email and Password is required'
        });
    }
}

async function checkToken(req, res, next) {

    if (req.url !== '/login'  && req.url !== '/reset' && req.url !== '/confirmdetails' && req.url !== '/createuser' ) {

        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

        if (token) {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }
        } else {
            return res.json({
                status: 401,
                success: false,
                message: 'Auth token is not supplied'
            });
        }

        if (token) {
            jwt.verify(token, process.env.jwt_secret, async (err, decoded) => {
                if (err) {
                    return res.json({
                        status: 401,
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                status: 401,
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    } else {
        next();
    }
}

async function users(req,res){
    const Users = await select('users',['userId','role','firstName','lastName','email','verified','country','updatedAt','createdAt']);
    return res.json({
        status: 200,
        success: true,
        data: Users
    });
}

module.exports = {
    login, checkToken, users
};