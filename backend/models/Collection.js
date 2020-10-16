const sequelize = require('./Sequelize.js')
const { DataTypes } = require('sequelize');

const Collection = sequelize.define('collection', {
    userID: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        isAlphanumeric: true
    },
    description: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.STRING
    },
    pic: {
        type: DataTypes.STRING
    },
    itemFields: { 
        type: DataTypes.STRING 
    }
});

module.exports = Collection;