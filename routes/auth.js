require('../config-passport');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto-js');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const upload = multer({ dest: 'data/fs/' })
    .fields([{ name: 'avaUrl', maxCount: 1 }]);

router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });


router.get('/register', (req, res) => {
    if (!req.user) res.render('register', { headline: "Register" });
    else res.redirect('/');
});

router.post('/register', upload, (req, res) => {
    console.log(req.body);
    if (req.body.password != req.body.passwordrepeat) {
        res.redirect('../auth/register' + '?err = You entered different passwords');
    } else {
        User.verificationOfExistence(req.body.login)
            .then(user_ => {
                if (user_) {
                    res.redirect('../auth/register' + "?err = Login exists. Try to enter another one bitch!");
                } else {
                    // if (req.files.avaUrl) {
                    //     req.body.avaUrl = '/' + req.files.avaUrl[0].filename;
                    // } else {
                    //     req.body.img = '/images/user.jpeg';
                    // }
                    // const img = req.body.img;
                    User.insert(new User(1, req.body.login, crypto.SHA512(req.body.password), req.body.role, req.body.fullname, Date.now(), undefined, false, req.body.bio, undefined, false, false, undefined))
                        .then(() => res.redirect('../auth/login'))
                        .catch(err => res.status(501).send(err));
                }

            })
            .catch(err => res.status(501).send(err));
    }
});

router.get('/login', function(req, res) {
    if (!req.user) res.render('login');
    else res.redirect('/');
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login' + '?err=Incorrent login or password',
    })
);

router.post('/logout', (req, res) => {
    console.log('logout');
    req.logout();
    res.redirect('/');
});

module.exports = router;