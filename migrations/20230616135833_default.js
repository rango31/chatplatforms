
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.string('userId').primary().notNull();
        table.string('fullName');
        table.string('email');
        table.string('password');
      }).createTable('useraccounts', function (table) {
        table.string('accountId').primary().notNull();
        table.string('userId');
        table.string('service');
        table.string('metadata');
        table.string('stage');
      }).createTable('messages', function (table) {
        table.string('messageId').primary().notNull();
        table.string('message');
        table.string('from');
        table.string('isGroup');
        table.datetime('DateReceived');
      })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('useraccounts')
};
