const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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

async function register(req,res) {
    let { email , password, fullname, vpassword } = req.body;

    if(!email || !password || !fullname || !vpassword){
        return res.json({
            status: 400,
            success: false,
            message: 'Please provide all fields'
        });
    }

    if(password !== vpassword){
        return res.json({
            status: 400,
            success: false,
            message: 'Passwords do not match'
        });
    }

    if(password.length < 4){
        return res.json({
            status: 400,
            success: false,
            message: 'Password should be atleast 4 chars long'
        });
    }

    password = bcrypt.hashSync(password, process.env.bcrypt_salt);

    let users = await getUserByLogin( email, password);

    if (users.length > 0) {
        return res.json({
            status: 400,
            success: false,
            message: `Email ${email} already registered`
        });
    }else{
        const user = {email, fullName:fullname, password, userId: uuidv4()}

        await insertRecord(user,'users');

        return res.json({
            status: 201,
            success: true,
            message: `Account registered`
        });


    }


}

async function checkToken(req, res, next) {

    if (req.url !== '/login'  && req.url !== '/register' ) {

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
    login, checkToken, users, register
};