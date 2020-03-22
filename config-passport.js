const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('./models/user');
const crypto = require('crypto-js');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: "1086866721835-rskgicm3n09kctj8ntvkpodgehoccefj.apps.googleusercontent.com",
        clientSecret: "x8KIv5Vk9YbOxZWoOWyUw6g4",
        callbackURL: "/auth/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.googleIdent(profile.id)
            .then(user => {

                if (user) {
                    console.log("User found " + user);
                    return user;
                } else {
                    console.log("Profile: " + profile);
                    let userReg = User.insert(new User(1, profile.displayName + "(G)", profile.id, 0, profile.displayName, Date.now(), undefined, false, "bio", undefined, false, false, undefined))
                    return userReg;
                }
            })
            .then(userf => {
                console.log("Here is user:" + userf);
                return done(null, userf)
            });
    }
));

passport.serializeUser(function(user, done) {
    console.log('Serilize: ', user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserialize: ', id);
    User.getById(id)
        .then(userf => {
            done(null, userf);
        })
        .catch(err => done(null, false))
});

passport.use(new LocalStrategy({ usernameField: 'login' },
    function(login, password, done) {
        User.verificationOfExistence(login)
            .then(user => {
                if (login != user.login) {
                    return done(null, false);
                }
                if (crypto.SHA512(password).toString() != user.password) {
                    return done(null, false);
                }
                return done(null, user);
            })
    }
));

passport.use(new BasicStrategy(
    function(login, password, done) {
        User.verificationOfExistence(login)
            .then(user => {
                if (!user || login != user.login) {
                    return done(null, false);
                }
                if (crypto.SHA512(password).toString() != user.password) {
                    return done(null, false);
                }
                return done(null, user);
            })
    }
));