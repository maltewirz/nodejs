const Sequelize = require('sequelize');
const mysqlConfig = require('./mysqlConfig.js');

const sequelize = new Sequelize(
    mysqlConfig.database, 
    mysqlConfig.user, mysqlConfig.password,
    {
        dialect: 'mysql', 
        host: 'localhost'
    });

module.exports = sequelize;