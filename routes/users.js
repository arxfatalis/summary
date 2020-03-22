const express = require('express');
const User = require('../models/user');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'data/fs/' })
    .fields([{ name: 'avaUrl', maxCount: 1 }]);

const auth_admin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role) {
            next();
        } else {
            return res.redirect('/auth/login' + '?err = You do not have administrator rights');
        }
    } else {
        return res.redirect('/auth/login' + '?err = You need to log in');
    }
}

router.get('/', auth_admin, (req, res) => {
    User.getAll()
        .then(users => res.render('users', {
            user: req.user,
            users: users,
            headline: "Users"
        }))
        .catch(err => res.status(500).send(err.toString()))
})

router.get('/:userId', auth_admin, (req, res) => {
    const userId = req.params.userId;
    User.getById(userId)
        .then(user => {
            if (typeof user === "undefined") {
                res.status(404).send(`User with id ${userId} not found`);
            } else {
                res.render("user", {
                    user: req.user,
                    user: user,
                    headline: "{user.login}"
                })
            }
        })
        .catch(err => res.status(500).send(err.toString()))
})

router.get('/update/:userId', function(req, res) {
    const userId = req.params.userId;
    User.getById(userId)
        .then(user => {
            user.body = user.body;
            user = req.user;
            res.render('games-update', { user: user, headline: "Update user", user: req.user });
        });
});
router.post('/update/:userId', upload, function(req, res) {
    const userId = req.params.userId
    const user = User.getById(userId)
    console.log(user)
    const login = req.body.login;
    if (req.files.avaUrl) {
        req.body.avaUrl = '/' + req.files.avaUrl[0].filename;
    } else {
        req.body.avaUrl = '/images/user.jpeg';
    }
    const avaUrl = req.body.avaUrl;
    const fullname = req.body.fullname;
    const bio = req.body.bio;
    const tgUsername = req.body.tgUsername;
    const newUser = new User(userId, login, user.password, user.role, fullname, user.registeredAt, avaUrl, user.isDisabled, bio, tgUsername, user.tgRegistered, user.tgMailing, user.chatId);
    //(id, login, password, role, fullname, registeredAt, avaUrl, isDisabled, bio, tgUsername, tgRegistered, tgMailing, chatId)
    User.updateById(newUser, userId)
        .then(userUpdated => res.redirect(`/games/` + userId))
        .catch(err => res.status(500).send(err.toString()))
});


module.exports = router;