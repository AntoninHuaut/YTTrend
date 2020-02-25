const mysql = require('mysql');
const config = require('../config.json');
const fs = require('fs');
const readline = require('readline');

function initTable() {
    return new Promise(resolve => {
        let rl = readline.createInterface({
            input: fs.createReadStream('./src/sql/table.sql'),
            terminal: false
        });

        let con = exports.getConnection();
        let line = "";

        rl.on('line', chunk => {
            line += chunk.toString('utf-8');
            if (!line.trim().endsWith(';')) return;

            line = line.replace(/(\r\n|\n|\r)/gm, '');
            con.query(line, (err) => {
                if (err && !err.sqlMessage.includes('already exists'))
                    console.error(err)
            });
            line = "";
        });

        rl.on('close', () => {
            con.end();
            resolve();
        });
    })
}

exports.getOptions = () => {
    return {
        host: config.sql.host,
        port: config.sql.port,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database
    };
}
exports.initTable = initTable;
exports.getConnection = () => {
    let con = mysql.createConnection(this.getOptions());
    con.connect();
    return con;
};

exports.manageTrend = require('./manageTrend');
exports.api = require('./api');