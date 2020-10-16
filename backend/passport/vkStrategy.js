const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport'),
      VKontakteStrategy = require('passport-vkontakte').Strategy,
      User = require('../models/User.js');

module.exports = function() {
    passport.use(new VKontakteStrategy({
        clientID: process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: process.env.VKONTAKTE_APP_SECRET,
        callbackURL: "http://localhost:3000/register/vk/callback"
      },
      function(accessToken, refreshToken, params, profile, done) {
        // console.log(params.email); // getting the email
        User.findOne( {where: { vkId: profile.id }})
        .then((user) => {
            if (user !='' && user !=null) {
                return done(null, user)
            } else {
            (async () => {
                const newUser = await User.create({
                    username: profile.username,
                    vkId: profile.id
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