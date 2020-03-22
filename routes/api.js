const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Character = require('../models/character');
const Game = require('../models/game');
const router = express.Router();

//, passport.authenticate('basic', { session: false })

router.get('/', (req, res) => {
    res.json({});
});

router.get('/me', (req, res) => {
    res.json(req.user);
});

router.get('/get_all_logins', function(req, res) {
    User.getAll().then(data => {
        let new_arr = [];
        for (let i in data) {
            new_arr.push({ login: data[i].login });
        }
        res.json(new_arr);
    })
});

router.post('/user', (req, res) => {
    User.insert(req.body)
        .then(() => res.json({ result: 'ok' }))
        .catch(err => res.status(501).send(err));
});

router.get('/user', (req, res) => {
    let search = req.query.find;
    User.getAll(search)
        .then(data => {
            if (!req.query.page) {
                req.query.page = 1;
            }
            if (data.length === 0) {
                res.status(204).json(null);
            }
            let eventsData = {
                currPage: req.query.page,
                Events: null,
                nextVisibility: true,
                prevVisibility: true,
                searchString: search,
                quantity: Math.ceil(data.length / 3),
            };
            if (req.query.page <= 1) {
                eventsData.prevVisibility = false;
            }
            if (req.query.page >= eventsData.quantity) {
                eventsData.nextVisibility = false;
            }
            if ((eventsData.currPage < 1 || eventsData.currPage > eventsData.quantity) && data.length !== 0) {
                eventsData.Events = data.slice(0, 3);
                res.json(eventsData);

            } else if (data.length !== 0) {
                eventsData.Events = data.slice((req.query.page - 1) * 3, (req.query.page - 1) * 3 + 3);
                res.json(eventsData);
            }
        }).catch(err => res.status(500).send(err.toString()))
});

router.get('/character', (req, res) => {
    let search = req.query.find;
    Character.getAll(search)
        .then(data => {
            if (!req.query.page) {
                req.query.page = 1;
            }
            if (data.length === 0) {
                res.status(204).json(null);
            }
            let eventsData = {
                currPage: req.query.page,
                Events: null,
                nextVisibility: true,
                prevVisibility: true,
                searchString: search,
                quantity: Math.ceil(data.length / 3),
            };
            if (req.query.page <= 1) {
                eventsData.prevVisibility = false;
            }
            if (req.query.page >= eventsData.quantity) {
                eventsData.nextVisibility = false;
            }
            if ((eventsData.currPage < 1 || eventsData.currPage > eventsData.quantity) && data.length !== 0) {
                eventsData.Events = data.slice(0, 3);
                res.json(eventsData);

            } else if (data.length !== 0) {
                eventsData.Events = data.slice((req.query.page - 1) * 3, (req.query.page - 1) * 3 + 3);
                res.json(eventsData);
            }
        }).catch(err => res.status(500).send(err.toString()))
});

router.get('/game', (req, res) => {
    let search = req.query.find;
    Game.getAll(search)
        .then(data => {
            if (!req.query.page) {
                req.query.page = 1;
            }
            if (data.length === 0) {
                res.status(204).json(null);
            }
            let eventsData = {
                currPage: req.query.page,
                Events: null,
                nextVisibility: true,
                prevVisibility: true,
                searchString: search,
                quantity: Math.ceil(data.length / 3),
            };
            if (req.query.page <= 1) {
                eventsData.prevVisibility = false;
            }
            if (req.query.page >= eventsData.quantity) {
                eventsData.nextVisibility = false;
            }
            if ((eventsData.currPage < 1 || eventsData.currPage > eventsData.quantity) && data.length !== 0) {
                eventsData.Events = data.slice(0, 3);
                res.json(eventsData);

            } else if (data.length !== 0) {
                eventsData.Events = data.slice((req.query.page - 1) * 3, (req.query.page - 1) * 3 + 3);
                res.json(eventsData);
            }
        }).catch(err => res.status(500).send(err.toString()))
});

router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    User.getById(userId)
        .then(user => {
            if (typeof user === "undefined") {
                res.status(404).send(`User with id ${userId} not found`);
            } else {
                res.json(user)
            }
        })
        .catch(err => res.status(500).send(err.toString()))
});

router.put('/user/:userId', (req, res) => {
    User.getById(req.params.id)
        .then(user => {
            if (!req.body) res.status(400).send(err.toString())
            else {
                if (req.body.login) user.login = req.body.login
                if (req.body.fullname) user.fullname = req.body.fullname
                if (req.body.password) user.password = crypto.SHA256(req.body.password)
                User.updateById(user, req.params.id)
                    .then(updated => res.status(200).json({ Updated: updated, Status: "Updated" }))
                    .catch(err => res.status(500).send(err.toString))
            }

        })
        .catch(err => res.status(404).send(err.toString()))
});

router.delete('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    User.deleteById(userId)
        .then(() => res.redirect('/users'))
        .catch(err => res.status(500).send(err.toString()))
});


router.post('/character', (req, res) => {
    Character.insert(req.body)
        .then(characterInserted => res.json({ status: 'ok' }))
        .catch(err => {
            res.status(404).send(err.toString());
            console.log(err);
        })
});

router.get('/character/:characterId', (req, res) => {
    const characterId = req.params.characterId;
    Character.getById(characterId)
        .then(character => {
            if (character) {
                res.json(character);
            } else {
                console.log("Error: 404");
                res.status(404);
            }
        })
        .catch(err => {
            res.status(404).send(err.toString());
            console.log(err);
        });
});

router.put('/character/:characterId', (req, res) => {
    Character.getById(req.params.id)
        .then(user => {
            if (!req.body) res.status(400).send(err.toString())
            else {
                if (req.body.login) user.login = req.body.login
                if (req.body.fullname) user.fullname = req.body.fullname
                if (req.body.password) user.password = crypto.SHA512(req.body.password)
                user.Character(user, req.params.id)
                    .then(updated => res.status(200).json({ Updated: updated, Status: "Updated" }))
                    .catch(err => res.status(500).send(err.toString))
            }
        })
        .catch(err => res.status(404).send(err.toString()))
});

router.delete('/character/:characterId', (req, res) => {
    const characterId = req.params.characterId;
    Character.deleteById(characterId)
        .then(() => res.redirect('/characters'))
        .catch(err => res.status(500).send(err.toString()))
});

module.exports = router;