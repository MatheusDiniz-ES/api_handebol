import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    "username": "root",
    "password": process.env.PASSWORD,
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
  production: {
    "username": "u899272621_handebol_itape",
    "password": process.env.PASSWORD_ONLINE,
    "database": "u899272621_handebol_itape",
    "host": "45.89.204.6",
    "dialect": "mysql",
  }
}
