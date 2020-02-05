const mysql = require('mysql2');
const mysqlConfig = require('./mysqlConfig.js');

const pool = mysql.createPool(mysqlConfig);

module.exports = pool.promise();
