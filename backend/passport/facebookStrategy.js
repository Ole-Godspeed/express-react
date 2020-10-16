const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport'),
      FacebookStrategy = require('passport-facebook').Strategy,
      User = require('../models/User.js');

module.exports = function() {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET,
        callbackURL: "http://localhost:3000/register/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne( {where: { facebookId : profile.id}})
        .then((user) => {
            if (user !='' && user !=null) {
                return done(null, user)
            } else {
            (async () => {
                const newUser = await User.create({
                    username: profile.displayName,
                    facebookId: profile.id
                });
                await newUser.save().then((user) => {
                    return done(null, user)         
                });
            })();   
            }
        })
      }
    ));
}