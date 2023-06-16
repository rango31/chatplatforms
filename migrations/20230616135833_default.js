
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.string('userId').primary().notNull();
        table.string('fullName');
        table.string('email');
        table.string('password');
      }) .createTable('useraccounts', function (table) {
        table.string('userId').primary().notNull();
        table.string('service');
        table.string('metadata');
        table.string('stage');
      })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('useraccounts')
};
