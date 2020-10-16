const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroSequelize = require('@admin-bro/sequelize');
const db = require('./models/Sequelize');
const User = require('./models/User'),
      Items = require('./models/Item'),
      Collections = require('./models/Collection');
const bcrypt = require('bcryptjs');

AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro({
  databases: [db],
  resources: [
    {
      resource: User,
      options: {
        listProperties: ['id', 'username', 'role', 'email', 'facebookId', 'vkId', 'createdAt', 'updatedAt'],
        properties: {
          role: {
            availableValues: [
              { value: 'admin', label: 'admin' },
              { value: 'restricted', label: 'restricted' },
              { value: 'blocked', label: 'blocked' } // + guest
            ]
          }
        },
        buttons: {
          new: 'Create new Comment',
        }
      }
    },
    { resource: Items },
    { resource: Collections }
  ],
  branding: {
    companyName: 'Admin Page',
    logo: null
  }
  // rootPath: '/'
});

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: 'admin-bro',
  cookiePassword: process.env.CSECRET,
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.password)
      if (matched && (user.role === 'admin' || user.id === 1)) {
        return user
      }
    }
    return false
  },
},
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

module.exports = { router };