
exports.up = function(knex) {
    return knex.schema.createTable('accounts', function (table) {
        table.string('accountId').primary().notNull();
        table.string('service');
        table.string('metadata');
        table.string('contacts',3000);
        table.string('stage');
        table.string('proxyId');
        table.string('userAgent')
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('createdAt').defaultTo(knex.fn.now());  
      }).createTable('proxies', function (table) {
        table.increments('proxyId').primary().notNull();
        table.string('url');
        table.string('username');
        table.string('password');
        table.string('status');
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('accounts')
        .dropTable('proxies')
};
