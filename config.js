const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    token: process.env.BOT_TOKEN,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dictUrl: process.env.dictUrl,
    dictAccept: process.env.dictAccept,
    dictId: process.env.dictId,
    dictKey: process.env.dictKey
}