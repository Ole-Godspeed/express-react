const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const mysql = require('mysql');
const Passport = require('./passport/Passport');
const Adminbro = require('./Adminbro'); 
const multer = require('multer')

app.use(cors({
  origin: "http://localhost:3002",
  credentials: true
}));

app.use('/admin', Adminbro.router);

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 * 100000,
    },
})
app.disable('x-powered-by')
app.use(multerMid.single('file'))

app.use(express.json({
    limit: '50mb',
    type: 'application/json'
}));
app.use(express.urlencoded({ 
    extended : false
}));

require('./models/Sequelize.js');

const dbconfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const connection = mysql.createConnection(dbconfig);
connection.connect(function(err) {
    if(err) {
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000)
    }
});

connection.connect(function(err) {
  if (err) {
      console.log('DB connect error');
      return false;
  }
});

// function handleDisconnect(connection) {
//     connection.on('error', function(err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//           handleDisconnect();                         
//         } else {                                      
//           throw err;                                  
//         }
//       });
// }
// handleDisconnect(connection);
// setInterval(function () {
//     connection.query('SELECT 1');
// }, 5000);

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, connection); 

app.use(session({
    key: process.env.CKEY,
    secret: process.env.CSECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        // httpOnly: false,
        secure: false
    }
}));

Passport(app);

// // logging session
// app.use((req, res, next) => {
//   console.log(req.session);
//   next();
// })

require('./Router')(app);

app.listen(process.env.PORT || "3000", function () {
    console.log('CORS-enabled web server listening')
});