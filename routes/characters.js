const express = require('express');
const multer = require('multer');
const Character = require('../models/character');
const router = express.Router();

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login' + '?err = You need to log in');
    }
}

const upload = multer({ dest: 'data/fs/' })
    .fields([{ name: 'img', maxCount: 1 }, { name: 'skinImgs' }]);



router.get('/new', auth, function(req, res) {
    res.render('characters-new', { headline: "Create new character", user: req.user });
});
router.post('/new', auth, upload, (req, res) => {
    const fullName = req.body.fullName;
    const region = req.body.region;
    const charYear = Number.parseInt(req.body.charYear);
    const rating = Number.parseInt(req.body.rating);
    const name2 = req.body.name2;
    if (req.files.img) {
        req.body.img = '/' + req.files.img[0].filename;
    } else {
        req.body.img = '/images/user.jpeg';
    }
    const img = req.body.img;
    const lor = req.body.lor;
    let skins = [];
    if (req.body.skinTitles) {
        for (let i = 0; i < req.body.skinTitles.length; i++) {
            skins.push({
                title: req.body.skinTitles[i],
                img: '/' + req.files.skinImgs[i].filename
            });
        }
    }
    const addTime = new Date();
    const newCharacter = new Character("dqwfsdfda", fullName, region, addTime, charYear, rating, name2, img, lor, skins);
    Character.insert(newCharacter)
        .then(characterInserted => res.redirect(`/characters/` + characterInserted.id))
        .catch(err => res.status(404).send(err.toString()))
});



router.post('/delete/:characterId', auth, (req, res) => {
    const characterId = req.params.characterId;
    Character.deleteById(characterId)
        .then(() => res.redirect('/characters'))
        .catch(err => res.status(500).send(err.toString()))
});
router.get('/update/:characterId', auth, function(req, res) {
    const characterId = req.params.characterId;
    Character.getById(characterId)
        .then(character => {
            character.body = character.body;
            user = req.user;
            res.render('characters-update', { character: character, headline: "Update character", user: req.user });
        });
});
router.post('/update/:characterId', auth, upload, function(req, res) {
    const characterId = req.params.characterId;
    const fullName = req.body.fullName;
    const region = req.body.region;
    const charYear = Number.parseInt(req.body.charYear);
    const rating = Number.parseInt(req.body.rating);
    const name2 = req.body.name2;
    if (req.files.img) {
        req.body.img = '/' + req.files.img[0].filename;
    } else {
        req.body.img = '/images/user.jpeg';
    }
    const img = req.body.img;
    const lor = req.body.lor;
    let skins = [];
    if (req.body.skinTitles) {
        for (let i = 0; i < req.body.skinTitles.length; i++) {
            skins.push({
                title: req.body.skinTitles[i],
                img: '/' + req.files.skinImgs[i].filename
            });
        }
    }
    const addTime = new Date();
    const newCharacter = new character(characterId, fullName, region, addTime, charYear, rating, name2, img, lor, skins);
    Character.updateById(newCharacter, characterId)
        .then(characterUpdated => res.redirect(`/characters/` + characterId))
        .catch(err => res.status(500).send(err.toString()))
});



router.get('/:characterId?', auth, (req, res) => {
    let characterId = req.params.characterId;
    if (characterId) {
        Character.getById(characterId)
            .then(character => {
                if (character) {
                    let skins = [];
                    if (character.skins) {
                        for (let i = 0; i < character.skins.length;) {
                            skins.push(character.skins.slice(i, i += 3));
                        }
                    }
                    res.render('character', { character, skins, headline: character.fullname, user: req.user });
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
        Character.getAll()
            .then(characters => {
                let perPage = 5;
                if (term) {
                    characters = characters.filter(
                        (character) => character.fullName.toLowerCase()
                        .includes(term.toLowerCase()));
                }
                let totalPages = Math.ceil(characters.length / perPage);
                res.render('characters', {
                    user: req.user,
                    headline: "Characters",
                    characters: characters.slice((page - 1) * perPage, page * perPage),
                    currentPage: page,
                    hasNextPage: page < totalPages,
                    nextPage: page + 1,
                    hasPrevPage: page > 1,
                    prevPage: page - 1,
                    term,
                    nothingFound: characters.length == 0,
                    totalPages
                });
            })
            .catch(err => res.status(500).send(err.toString()))
    }
});

module.exports = router;