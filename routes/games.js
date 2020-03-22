const express = require('express');
const multer = require('multer');
const Game = require('../models/game');
const router = express.Router();

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login' + '?err = You need to log in');
    }
}

const upload = multer({ dest: 'data/fs/' })
    .fields([{ name: 'img', maxCount: 1 }]);



router.get('/new', auth, function(req, res) {
    res.render('games-new', { headline: "Create new game", user: req.user });
});
router.post('/new', auth, upload, (req, res) => {
    const name = req.body.name;
    const genre = req.body.genre;
    const year = Number.parseInt(req.body.year);
    const rating = Number.parseInt(req.body.rating);
    const creator = req.body.creator;
    if (req.files.img) {
        req.body.img = '/' + req.files.img[0].filename;
    } else {
        req.body.img = '/images/user.jpeg';
    }
    const img = req.body.img;
    const about = req.body.about;
    const newGame = new Game("dqwfsdfda", name, genre, year, rating, creator, img, about);
    Game.insert(newGame)
        .then(gameInserted => res.redirect(`/games/` + gameInserted.id))
        .catch(err => res.status(404).send(err.toString()))
});



router.post('/delete/:gameId', auth, (req, res) => {
    const gameId = req.params.gameId;
    Game.deleteById(gameId)
        .then(() => res.redirect('/games'))
        .catch(err => res.status(500).send(err.toString()))
});
router.get('/update/:gameId', auth,  function(req, res) {
    const gameId = req.params.gameId;
    Game.getById(gameId)
        .then(game => {
            game.body = game.body;
            user = req.user;
            res.render('games-update', { game: game, headline: "Update game", user: req.user });
        });
});
router.post('/update/:gameId', auth, upload, function(req, res) {
    const gameId = req.params.gameId
    const name = req.body.name;
    const genre = req.body.genre;
    const year = Number.parseInt(req.body.year);
    const rating = Number.parseInt(req.body.rating);
    const creator = req.body.creator;
    if (req.files.img) {
        req.body.img = '/' + req.files.img[0].filename;
    } else {
        req.body.img = '/images/user.jpeg';
    }
    const img = req.body.img;
    const about = req.body.about;
    const newGame = new Game(gameId, name, genre, year, rating, creator, img, about);
    Game.updateById(newGame, gameId)
        .then(gameUpdated => res.redirect(`/games/` + gameId))
        .catch(err => res.status(500).send(err.toString()))
});



router.get('/:gameId?', auth, (req, res) => {
    const gameId = req.params.gameId;
    if (gameId) {
        Game.getById(gameId)
            .then(game => {
                if (game) {
                    res.render('game', { game, headline: game.name, user: req.user });
                }
            })
            .catch(err => res.status(404).send(err.toString()))
    } else {
        let { term, page } = req.query;
        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        }
        Game.getAll()
            .then(games => {
                let perPage = 5;
                if (term) {
                    games = games.filter(
                        (game) => game.name.toLowerCase()
                        .includes(term.toLowerCase()));
                }
                let totalPages = Math.ceil(games.length / perPage);
                res.render('games', {
                    user: req.user,
                    headline: "Games",
                    games: games.slice((page - 1) * perPage, page * perPage),
                    currentPage: page,
                    hasNextPage: page < totalPages,
                    nextPage: page + 1,
                    hasPrevPage: page > 1,
                    prevPage: page - 1,
                    term,
                    nothingFound: games.length == 0,
                    totalPages
                });
            })
            .catch(err => res.status(500).send(err.toString()))
    }
});

module.exports = router;