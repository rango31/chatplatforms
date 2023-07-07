// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'password',
      database: 'chatplatforms',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: 'mysql',
    connection: {
      host: '',
      port: 3306,
      user: 'root',
      password: 'PASSWORD',
      database: 'chatplatforms',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
