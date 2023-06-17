const { v4: uuidv4 } = require('uuid');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      //p  = password321
      return knex('users').insert([
        {userId: uuidv4(), fullName: 'Super User', email:'superuser@chatp.com',password:'$2a$06$bghdsSsGHJG3554AaSDSDeCvdSECdhKUaJRlmH21VB4Kzl3hR.lgG'},
      ]);
    });
};
