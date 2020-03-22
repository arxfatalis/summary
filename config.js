require('dotenv').config()
module.exports = {
    serverPort: process.env["PORT"] || 3000,
    databaseUrl: process.env["DATABASE_URL"] || 'mongodb://localhost:27017/lab5db',
    bot_token: process.env['TELEGRAM_BOT_TOKEN'],
}