require('dotenv-safe').config();
const mysql = require('mysql2/promise');

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    global.connection = connection;
    return connection;
}

async function getUser(user, password) {
    const query = 'select * from cho2021_user where EMAIL = \"' + user + '\" AND PASSWORD = \"' + password + '\";';

    const conn = await connect();
    const [rows] = await connection.query(query);
    return rows;
}

module.exports = {getUser}