const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Todo', 'In Progress', 'Done'),
    defaultValue: 'Todo',
  },
  priority:{
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
  dueDate:{
    type:DataTypes.DATE,
  },
  documents:{
    type:DataTypes.JSONB, //Stores an array of S3 URLs
    defaultValue:[],
  }
}, {timestamps: true});

User.hasMany(Task, {foreignKey: 'assignedTo'});
Task.belongsTo(User, {foreignKey: 'assignedTo'});

module.exports = {User, Task};