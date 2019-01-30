const commando = require('discord.js-commando')
const Command = commando.Command
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class defdisableCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'disabledefrole',
            memberName: 'disabledefrole',
            group: 'role',
            aliases: ['default-disable', 'disable-defrole', 'disdef', 'defdis'],
            examples: ['=disabledefrole', '=default-disable'],
            description: 'Resets the default joining role.',
            details: 'Resets the default role given to all members who join the server.',
            guildOnly: true,
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    run(msg) {

        try {
            mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
                useNewUrlParser: true
            }, (err, res) => {
                if (!err) {
                    if (res) {
                        let db = res.db('trendy')
                        let servercol = db.collection('servdata')
                        servercol.findOneAndUpdate({
                            '_id': msg.guild.id
                        }, {
                            $set: {
                                'defrole': 'disabled'
                            }
                        }, (err, result) => {
                            if (err) {
                                return msg.reply(' couldn\'t resset the default role. :cry:')
                            } else {
                                return msg.reply(` default role reset. :ballot_box_with_check: \nUsually starts working as it's supposed to in 2 minutes.`)
                            }
                        })
                    }
                }
            })
        } catch (error) {
            console.error(error)
        }

    }

}

module.exports = defdisableCommand