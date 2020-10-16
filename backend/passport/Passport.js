const passport = require('passport');

const localStrategy = require('./localStrategy'),
      facebookStrategy = require('./facebookStrategy'),
      vkStrategy = require('./vkStrategy');

module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser((user, done) => {
        done(null, user);
    })
    passport.deserializeUser(function(user, done){
        done(null, user);
    });
   
    localStrategy();
    facebookStrategy();
    vkStrategy();
}