// Check on 9:09 PM - 15/07/2020

const passport = require("passport");
const strategy = require("passport-facebook");

const FacebookStrategy = strategy.Strategy;

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
cb(null, obj);
});

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.fb_client_id,
            clientSecret: process.env.fb_client_secret,
            callbackURL: 'http://localhost:7000/login/callback',
            enableProof: true,
            profileFields: ["emails", "name"],
        },
        function(accessToken, refreshToken, profile, done) {
            const data = {
                accessToken,
                profile: {...profile, twitterTag: ''}
            }
            done(null, data);            
        }
    )
);

const { fetchByID, insertDoc } = require('../utils/db_util');

module.exports = (app, db) => {

    app.get('/logout', (req, res) => {
        req.logout();
        res.send(true);
    })

    app.get('/login',passport.authenticate('facebook',{scope : ['email',"user_posts"] }));

    app.get('/login/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
        const {profile} = req.user;
        fetchByID(db, 'users', String(profile._json.id))
        .then(data => {
            req.user.save()
            res.redirect('http://localhost')
        })
        .catch(error => {
            insertDoc(db, 'users', profile._json, profile._json.id)
            .then((x) => {
                res.redirect('http://localhost')
                req.user.save()
            })
            .catch(error => {
                res.status(500).send("Error occurred while logging in");
            })
        })
    });

    app.post('/check_session', (req, res) => {
        if (req.user){
            fetchByID(db, 'users', String(req.user.profile._json.id))
            .then(data => {
                req.user.profile.twitterTag = data.twitterTag;
                console.log(data)
                res.send({...req.user, profile: {...req.user.profile,twitterTag: data.twitterTag, facebook_save: data.facebook_save, twitter_save: data.twitter_save},analysis: data.analysis});                    
            })
            .catch(error => {
                res.send({...req.user, twitterTag: ''});                    
            })

        } else {
            res.status(400).send(false);
        }
    })

}