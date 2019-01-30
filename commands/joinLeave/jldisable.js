const commando = require('discord.js-commando')
const Command = commando.Command
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class jldisableCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'disable-jl',
            memberName: 'disable-jl',
            group: 'jl',
            aliases: ['jl-disable', 'disablejl', 'disjl', 'jldis'],
            examples: ['..disablejl', '..jl-disable'],
            description: 'Disables the join-leave messages.',
            details: 'Disables the join-leave messages sent when an user join or leaves the server.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
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
                                'channel': 'disabled'
                            }
                        }, (err, result) => {
                            if (err) {
                                return msg.reply(' couldn\'t disable the join-leave messages. :cry:')
                            } else {
                                return msg.reply(` Join-leave messages disabled :ballot_box_with_check: \nUsually starts working as it's supposed to in 2 minutes.`)
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

module.exports = jldisableCommand