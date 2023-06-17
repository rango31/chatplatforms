'use strict';
const jwt = require('jsonwebtoken');
const rn = require('random-number');

const getUserByLogin = async (email, password) => {
    const users = await knex('users')
    .select(['userId', 'email', 'fullName'])
    .where({'email': email , 'password': password})
    .catch((ex)=>{
        console.log(ex);
        return [];
    });

    return users;
}

const getToken = async (user) => {
    const { email, userId, role } = user;
    const token = jwt.sign({ email, id: userId, role },
        process.env.jwt_secret,
        {
            expiresIn: '48 hours'
        }
    );

    return token;
}

const saveNewUser = async (data) => {
    const res = await knex('users')
        .insert(data)
        .catch((ex)=>{
           console.log(ex)
        });

    if(res.affectedRows > 0){
        return true;
    }else{
        return false;         
    }
}

const updateUser = async (data) => {
}

const saveUserCompany = async ( comapnyName ) => {
}

const generateOTP = async () => {
    const gen = rn.generator({
        min: 1000000,
        max: 9999999,
        integer: true
    });

    const otp = await gen();

    return `${otp}`;
}

module.exports = {
    getUserByLogin, getToken, saveUserCompany, generateOTP
};