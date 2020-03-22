const config = require('../config');

const TelegramBotApi = require('telegram-bot-api');

const User = require('../models/user');
const Character = require('../models/character');
const Game = require('../models/game');

const telegramBotApi = new TelegramBotApi({
    token: config.bot_token,
    updates: {
        enabled: true // do message pull
    }
});

telegramBotApi.on('message', onMessage);

async function registerTgUser(chatId, username) {
    const user_chatId = await User.verificationOfExistenceTgChatId(chatId)
    if (user_chatId) {
        return 'user_chatId'
    } else {
        const user_tgUsername = await User.verificationOfExistenceTgUsername(username)
        if (user_tgUsername) {
            const user_reg = await User.registerById(user_tgUsername._id, chatId)
            if (user_reg) {
                return 'done'
            } else {
                return 'error'
            }
        } else {
            return 'needUsername'
        }
    }
}

async function AllUsers(chatId) {
    const user = await User.verificationOfExistenceTgChatId(chatId)
    if (user) {
        if (user.role) {
            const users = User.getAllUsers()
            return users
        } else {
            return 'user'
        }
    } else {
        return 'notreg'
    }
}

async function AllGames(chatId) {
    const user = await User.verificationOfExistenceTgChatId(chatId)
    if (user) {
        const games = Game.getAllGames()
        return games
    } else {
        return 'notreg'
    }
}

async function allCharacters(chatId) {
    const user = await User.verificationOfExistenceTgChatId(chatId)
    if (user) {
        const characters = Character.getAllCharacters()
        return characters
    } else {
        return 'notreg'
    }
}

async function subscribeTgUser(username) {
    User.verificationOfExistenceTgUsername(username)
        .then(user_ => {
            if (user_) {
                if (user_.tgRegistered) {
                    User.setMailing(user_._id, true)
                        .then(() => {})
                } else {}
            } else {}
        })
}

async function unsubscribeTgUser(username) {
    User.verificationOfExistenceTgUsername(username)
        .then(user_ => {
            if (user_) {
                if (user_.tgRegistered) {
                    User.setMailing(user_._id, false)
                        .then(() => {})
                } else {}
            } else {}
        })
}

function onMessage(message) {
    processRequest(message)
        .catch(err => telegramBotApi.sendMessage({
            chat_id: message.chat.id,
            text: `Something went wrong. Try again later. Error: ${err.toString()}`,
        }));
}

async function processRequest(message) {
    let messageToSend;
    const chatId = message.chat.id;
    const username = message.from.username;
    if (message.text === '/start') {
        const message = await registerTgUser(chatId, username)
        console.log('message:' + message)
        if (message === 'user_chatId') {
            messageToSend = 'Sorry, but user with such username is already registered.'
        } else if (message === 'needUsername') {
            messageToSend = 'You need to enter a telegram username on the site.'
        } else if (message === 'done') {
            messageToSend = 'You have just been registered in the telegram bot!'
        } else if (message === 'error') {
            messageToSend = 'Something went wrong... We could not register you. Try again later'
        }
    } else if (message.text === '/characters') {
        const message = await allCharacters(chatId)
        if (message === 'notreg') {
            messageToSend = 'You need to registered on telegram bot';
        } else {
            messageToSend = 'Characters:\n'
            for (const char of message) {
                messageToSend += char.fullname + '(' + char._id + ')' + ',' + '\n'
            }
        }
    } else if (message.text === '/games') {
        const message = await AllGames(chatId)
        if (message === 'notreg') {
            messageToSend = 'You need to registered on telegram bot';
        } else {
            messageToSend = 'Games:\n'
            for (const game of message) {
                messageToSend += game.name + '(' + game._id + ')' + ',' + '\n'
            }
        }
    } else if (message.text === '/users') {
        const message = await AllUsers(chatId)
        if (message === 'user') {
            messageToSend = 'Sorry but you dont have administrator privileges';
        } else if (message === 'notreg') {
            messageToSend = 'You need to registered on telegram bot';
        } else {
            messageToSend = 'Users:\n'
            for (const user of message) {
                messageToSend += user.fullname + '(' + user._id + ')' + ',' + '\n'
            }
        }
    } else if (message.text === '/subscribe') {
        await subscribeTgUser(username);
        console.log(`User ${username} subscribed to the newsletter!`);
    } else if (message.text === '/unsubscribe') {
        await unsubscribeTgUser(username);
        console.log(`User ${username} subscribed to the newsletter!`);
    } else {
        messageToSend = "Enter the correct command"
    }
    console.log("Username:" + message.from.username, ",message:" + message.text);
    return telegramBotApi.sendMessage({
        chat_id: chatId,
        text: messageToSend,
    });
}

module.exports = {
    async sendNotification(text) {
        const users = await User.getAll();
        console.log(`Notify ${users.length} users`);
        for (const userId of users) {
            await telegramBotApi.sendMessage({
                chat_id: userId,
                text: text,
            });
        }
    }
};