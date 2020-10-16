const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('../models/User.js'),
      bcrypt = require('bcryptjs');

module.exports = function() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
    function(username, password, done) {
        User.findOne({ where: { email: username } })
            .then((user) => {
                if (!user) { return done(null, false) }
                bcrypt.compare(password, user.password, (bcryptErr, verified) => {      
                    if (verified) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                });  
            })
            .catch((err) => {   
                done(err);
            });
    }
    ));
}