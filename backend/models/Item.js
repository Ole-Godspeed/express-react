const sequelize = require('./Sequelize.js')
const { DataTypes } = require('sequelize');

const Item = sequelize.define('item', {
    userID: { type: DataTypes.INTEGER },
    colID: { type: DataTypes.INTEGER },
    name: {
        type: DataTypes.STRING,
        isAlphanumeric: true
    },
    description: { type: DataTypes.TEXT },
    tags: { type: DataTypes.STRING },
    customFields: { type: DataTypes.JSON }
}, {
    indexes: [
        { type: 'FULLTEXT', name: 'json_idx', fields: ['customFields'] },
        { type: 'FULLTEXT', name: 'string_idx', fields: ['name'] },
        { type: 'FULLTEXT', name: 'text_idx', fields: ['description'] }
    ]
});

module.exports = Item;