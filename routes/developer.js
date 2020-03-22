const express = require('express');
const path = require('path');
const router = express.Router();

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login' + '?err = You need to log in');
    }
}

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/api.html'));
})

module.exports = router;
