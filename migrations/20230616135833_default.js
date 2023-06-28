
exports.up = function(knex) {
    return knex.schema.createTable('useraccounts', function (table) {
        table.string('accountId').primary().notNull();
        table.string('userId');
        table.string('service');
        table.string('metadata');
        table.string('stage');
        table.string('proxyGroup');
      }).createTable('proxyGroups', function (table) {
        table.string('proxyGroupId').primary().notNull();
        table.string('url');
        table.string('username');
        table.string('password');
      })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('useraccounts')
        .dropTable('useraccounts')
};
