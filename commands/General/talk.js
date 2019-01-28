const {
    Command
} = require('discord.js-commando')
const config = require('../../config')

const mongo = require('mongodb').MongoClient

class talkCommand extends Command {

    constructor(client) {

        super(client, {
            name: 'talk',
            memberName: 'talk',
            description: 'Enable/Disable the talking functionality.',
            details: 'Turns on ( or off ) the talking feature i.e. autoresponder to things like `Hi` and `Bye`.\nMessages won\'t be sent more than once every five minutes and no spam is also guaranteed.',
            aliases: ['t'],
            group: 'general',
            examples: ['..talk enable', '..talk disable'],
            guildOnly: true,
            args: [{
                key: 'comm',
                type: 'string',
                prompt: 'Would you like to `enable` or `disable` the talking?',
                validate: comm => {
                    if (comm.toLowerCase().trim() != "enable" && comm.toLowerCase().trim() != "disable")
                        return "You can only `enable` or `disable`."
                    else
                        return true
                }
            }],
            userPermissions: ['ADMINISTRATOR']
        })

    }

    run(msg, {
        comm
    }) {
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
            useNewUrlParser: true
        }, (err, dbo) => {
            if (!err) {
                if (dbo) {
                    let db = dbo.db('trendy')
                    let servcol = db.collection('servdata')

                    if (comm.toLowerCase().trim() == 'enable') {
                        servcol.findOneAndUpdate({
                            '_id': msg.guild.id
                        }, {
                            $set: {
                                'talk': 'enable'
                            }
                        }, function (err, res) {
                            if (err) {
                                return msg.reply(" sorry but the talking functionality could not be enabled.\nTry again in 5 minutes or contact my developer.")
                            } else {
                                return msg.reply(` you just activated my talking functionality for the server - **${msg.guild.name || "This DM"}**.\n I will be able to talk with everyone within 2 minutes.`)
                            }
                        })
                    }
                    if (comm.toLowerCase().trim() == 'disable') {
                        servcol.findOneAndUpdate({
                            '_id': msg.guild.id
                        }, {
                            $set: {
                                'talk': 'disable'
                            }
                        }, function (err, res) {
                            if (err) {
                                return msg.reply(" sorry but the talking functionality could not be disabled.\nTry again in 5 minutes or contact my developer.")
                            } else {
                                return msg.reply(` you just deactivated my talking functionality for the server - **${msg.guild.name || "This DM"}**.`)
                            }
                        })
                    }
                }
            }
        })
    }

}

module.exports = talkCommand