const User = require('./models/User.js'),
      Collection = require('./models/Collection.js'),
      Item = require('./models/Item.js');
const Sequelize = require('./models/Sequelize.js')
const passport = require('passport')
const uploadImage = require('./gcloud/Gcloud')

module.exports = function(app) {

  app.post('/home', (req,res) => {
    User.findAll()
    .then((users) => {
        return res.json({ users: users});
    })
    .catch((err) => {   
        console.log(err);
        return res.json({ users: []});
    });                 
  });

    app.post("/search", (req, res) => {
        Item.findAll({
            where: Sequelize.literal(
                'MATCH(customFields) AGAINST(:name) OR MATCH(description) AGAINST(:name) OR MATCH(name) AGAINST(:name)'
            ),
            replacements: {
                name: req.body.sdata
            }
        }).then((result) => {
            console.log(result);
            res.json({ success: true, sdata: result });
        })
    })

    app.post('/register', (req,res) => {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password1;

        username = username.toLowerCase();
        email = email.toLowerCase();
        let hashPass = require('bcryptjs').hashSync(password, 9);
        
        (async () => {
            try {
                const newUser = await User.create({
                    username: username,
                    email: email,
                    password: hashPass
                });
                await newUser.save();
                
                req.login(newUser, function(err) {
                    if (err) { console.log(err) }
                    res.json({ success: true });
                });

            } catch (e) {
                console.error(e);
                res.json({ success: false, msg: e.errors[0].message }) 
            }  
        })();
    });    
  
    app.get('/register/facebook/', passport.authenticate('facebook')); 
    app.get('/register/facebook/callback', passport.authenticate('facebook'),
        function(req, res) { res.redirect('http://localhost:3001') }
    );

    app.get('/register/vk', passport.authenticate('vkontakte'));
    app.get('/register/vk/callback', passport.authenticate('vkontakte'),
        function(req, res) { res.redirect('http://localhost:3001') }
    );

    app.post('/login', 
        passport.authenticate('local'),
        function(req, res) { res.json({ username: req.session.passport.user.username }) }
    );  

    app.post('/logout', (req, res) => {
        if (req.session.passport) {
            req.session.destroy();
            res.json({ success: true })
        } else {
            res.json({ success: false })
        } 
    });

    app.post('/getsession', (req,res) => {
        if (!req.session.passport) {
            res.json({ name: 'Guest', role: 'guest', id: -1});
        } else {
            res.json({
                name: req.session.passport.user.username,
                role: req.session.passport.user.role,
                id: req.session.passport.user.id
            })
        }
    });

    app.post('/users/id:id', (req,res) => {
        User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (!user) {
                return res.json({ result: false, msg: 'No such user'})
            } else {
                Collection.findAll({ where: { userID: req.params.id } })
                .then((col) => {
                    return res.json({                            
                        success: true,
                        col: col,
                        username: user.username,
                        role: user.role
                    }) 
                })
            }
        })
        .catch((err) => {   
            console.log(err);
            return res.json({ result: false, msg: 'Database error. Feel free to try again.'});
        });                 
    });

    app.post('/users/id:id/createcol', (req,res) => {
        (async () => {
            try {
                await Collection.create({
                    name: req.body.name,
                    description: req.body.desc,
                    userID: req.params.id,
                    category: req.body.category,
                    itemFields: req.body.itemFields
                })
                .then( async function (col) {   
                    if (req.body.images.length !== 0) {
                        const colID = col.get('id')
                        const imageUrl = await uploadImage(req.body.images[0], colID)
                        await col.update({ pic: imageUrl })     
                    }
                })
                res.json({ success: true })
            } catch (e) {
                console.error(e);
                res.json({ success: false }) 
            } 
        })();
    });

    app.post('/users/id:id/c:col', (req,res) => {
        User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (!user) {
                return res.json({ result: false, msg: 'No such user'})
            } else {
                Collection.findOne({ where: { id: req.params.col } })
                .then((col) => {
                    if (!col) {
                        return res.json({ result: false, msg: 'No such collection'})
                    } else {
                        Item.findAll({ where: { colID: req.params.col } })
                        .then((items) => {
                            return res.json({   
                                col: col,                         
                                success: true,
                                items: items,
                                username: user.username,
                                role: user.role,
                            }) 
                        })
                    }
                })
            }
        })
        .catch((err) => {   
            console.log(err);
            return res.json({ result: false, msg: 'Database error. Feel free to try again.'});
        });                 
    });

    app.post('/users/id:id/c:col/createitem', (req,res) => {
        (async () => {
            try {
                await Item.create({
                    name: req.body.name,
                    description: req.body.desc,
                    userID: req.params.id,
                    customFields: req.body.customFields,
                    colID: req.params.col
                })
                res.json({ success: true })
            } catch (e) {
                console.error(e);
                res.json({ success: false }) 
            } 
        })();
    });

}