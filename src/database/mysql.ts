import mysql from 'mysql2';

import authConfig from '../config/auth.json';

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: "root",
//     password: authConfig.password,
//     database: 'hand_itape'
// });
const connection = mysql.createConnection({
    host: '45.89.204.6',
    user: "u899272621_handebol_itape",
    password: authConfig.password_online,
    database: 'u899272621_handebol_itape'
});

connection.connect(error => {
    if (error) {
        console.log("Error connect: " + error.stack);
        return;
    }

    console.log("Database connected " + connection.threadId);
})

export default { connection };