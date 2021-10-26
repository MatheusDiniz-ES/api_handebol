import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: "root",
//     password: authConfig.password,
//     database: 'hand_itape'
// });
const connection = mysql.createConnection({
    host: '45.89.204.6',
    user: "u899272621_handebol_itape",
    password: process.env.PASSWORD_ONLINE,
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