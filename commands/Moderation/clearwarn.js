const discord = require('discord.js')
const {
    Command
} = require('discord.js-commando')
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class clearwarnCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'clearwarn',
            memberName: 'clearwarn',
            group: 'moderation',
            aliases: ['clearwarning', 'clearwarns', 'clearwarnings'],
            guildOnly: true,
            description: 'Deletes entries from the "*criminal record*" of the user.',
            details: 'Deletes one or all entries from the "*criminal record*" of the @mentioned-user.',
            userPermissions: ['KICK_MEMBERS'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Whose warnings would u like to delete?'
            }, {
                key: 'number',
                type: 'integer',
                prompt: 'Which warning would you like to delete?',
                default: -1
            }],
            examples: ['..clearwarn @HS 1', '..clearwarn @HS']
        })
    }

    run(msg, {
        user,
        number
    }) {
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
            useNewUrlParser: true
        }, (err, dbo) => {
            let db = dbo.db('trendy')
            let warncol = db.collection('warnings')
            let embed = new discord.RichEmbed()
            embed.setTitle(`Clearwarn`)
                .setTimestamp()
                .setThumbnail(this.client.user.avatarURL)
            warncol.find({
                'user': user.id
            }, {
                sort: {
                    time: 1
                }
            }).toArray().then(warnlist => {
                if (warnlist.length > 0) {
                    if (number != -1) {
                        if (warnlist.length > (number - 1)) {
                            let idToDelete = warnlist[number - 1]._id
                            let warnToDelete = warnlist[number - 1]
                            warncol.findOneAndDelete({
                                _id: idToDelete
                            }, (error, res) => {
                                if (error) {
                                    embed.setDescription("Unable to delete warning. :sob:")
                                    embed.setColor("RED")
                                } else {
                                    embed.addField("Moderator", warnToDelete.mod, true)
                                    embed.addField("Reason", warnToDelete.reason, true)
                                    embed.addField("User", `<@${warnToDelete.user}>`, true)
                                    embed.setColor("GREEN")
                                }
                                msg.channel.send(embed).then(message => {
                                    message.react('☑')
                                })
                            })
                        } else {
                            embed.setDescription(`Invalid number provided.\nThe user cuurently has only ${warnlist.length} warnings.`)
                            embed.setColor("RED")
                            msg.embed(embed)
                        }
                    } else {
                        warncol.deleteMany({
                            'user': user.id,
                            'server':msg.guild.id
                        }, (error, res) => {
                            if (error) {
                                embed.setDescription("There was an error deleting the warnings.")
                                    .setColor("RED")
                                msg.embed(embed)
                            } else {
                                embed.setDescription(`All warnings deleted for user ${user}.`)
                                    .setColor("GREEN")
                                msg.channel.send(embed).then(message => {
                                    message.react('☑')
                                })
                            }
                        })
                    }
                } else {
                    embed.setDescription("The user currently has no warnings.")
                    embed.setColor("GREEN")
                    msg.embed(embed)
                }

            })
        })
    }

}

module.exports = clearwarnCommand