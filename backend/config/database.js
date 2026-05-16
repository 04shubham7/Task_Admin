const {sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSW, {
  dialect: 'postgres',
  logging: false, // set to console.log to see raw SQL queries
});

module.exports = sequelize;