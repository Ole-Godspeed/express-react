const sequelize = require('./Sequelize.js')
const { DataTypes } = require('sequelize');
const Collection = require('./Collection.js');

const User = sequelize.define('user', {
    username:{
        type: DataTypes.STRING,
        isAlphanumeric: true
    },
    email:{
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: 'User with email already exists.'
        },
        validate: {
            isEmail: {
                msg: 'Invalid Email.'
            }
        }
    },
    password:{
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'restricted'
    },
    vkId: { type: DataTypes.STRING },
    facebookId: { type: DataTypes.STRING },
}, { 
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

// User.belongsToMany(Collection, {through: 'UserCollections'});

module.exports = User;

