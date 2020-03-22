const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./config-passport');
app.use(cookieParser());

app.use(session({
    secret: 'secretWord',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 30 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const charactersRouter = require('./routes/characters');
app.use('/characters', charactersRouter);
const gamesRouter = require('./routes/games');
app.use('/games', gamesRouter);

const developerRouter = require('./routes/developer');
app.use('/developer/v1', developerRouter);
const apiRouter = require('./routes/api');
app.use('/api/v1', apiRouter);

const Telegram = require('./modules/telegram');

app.use(express.static('public'));
app.use(express.static('data/fs'));

app.engine('mst', mustacheExpress(path.join(__dirname, 'views', 'partials')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mst');

app.get('/', (req, res) => {
    res.render('index', { headline: "Fun base characters", user: req.user });
});

app.get('/about', (req, res) => {
    res.render('about', { headline: "About", user: req.user });
});

// app.get('/telegram', (req, res) => res.render('telegram-mailing'));

// app.post('/telegram', async(req, res) => {
//     const text = req.body.payload;
//     try {
//         await Telegram.sendNotification(text);
//         console.log('> Event payload:', text);
//         res.redirect('/');
//     } catch (err) {
//         res.send(err.toString());
//     }
// });

const config = require('./config');
const databaseUrl = config.databaseUrl;
const serverPort = config.serverPort;
const connectOptions = { useUnifiedTopology: true, useNewUrlParser: true };

mongoose.connect(databaseUrl, connectOptions)
    .then(() => console.log(`Database connected: ${databaseUrl}`))
    .then(() => app.listen(serverPort, () => console.log(`Server started: ${serverPort}`)))
    .catch(err => console.log(`Start error: ${err}`))