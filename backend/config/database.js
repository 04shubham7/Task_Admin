const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskdb',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || process.env.DB_PASSWORD || 'password',
  {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false, // set to console.log to see raw SQL queries
  }
);

module.exports = sequelize;