const { password, password_online } = require('./auth.json');

module.exports = {
  production: {
    "username": "root",
    "password": password,
    "database": "hand_itape",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  test: {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  development: {
    "username": "u899272621_handebol_itape",
    "password": password_online,
    "database": "u899272621_handebol_itape",
    "host": "45.89.204.6",
    "dialect": "mysql",
  }
}
