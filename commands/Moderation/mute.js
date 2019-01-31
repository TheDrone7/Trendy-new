const discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
const missingPerms = require('./perms');
const mongo = require('mongodb');
const ms = require('ms')
const config = require('../../config')

class muteCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'mute',
            memberName: 'mute',
            group: 'moderation',
            description: 'Mutes an user in the server.',
            details: 'Mutes the @mentioned-user in the server where the command is used.\nBy default for 1 day.',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['BAN_MEMBERS'],
            examples: ['=mute @HS', '=mute @HS 2 days.'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to ban?'
            }, {
                key: 'duration',
                type: 'string',
                prompt: 'For how long would you like to mute them?',
                default: '86400000'
            }]
        });
    }

    async run(msg, {
        user,
        duration
    }) {
        let embed = new discord.RichEmbed({
            title: 'Mute',
            author: {
                name: msg.member.displayName,
                icon_url: msg.author.avatarURL
            }
        })
        embed.setThumbnail(this.client.user.avatarURL)
            .setTimestamp()
        let mutrole = null;
        let msduration = 86400000;
        if (isNaN(duration)) {
            msduration = ms(duration);
        } else {
            msduration = parseInt(duration);
        }
        let mutrolelist = msg.guild.roles.filter(role => role.name.toLowerCase().indexOf("muted") > -1).array();
        if (mutrolelist.length > 0) {
            mutrole = mutrolelist[0];
            mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
                        useNewUrlParser: true
                    }, (err, dbo) => {
                        if (!err) {
                            let db = dbo.db('trendy')
                            let mutecol = db.collection('mutes')
                            mutecol.findOneAndUpdate({
                                user: user.id,
                                server: user.guild.id
                            }, {
                                $set: {
                                    duration: Date.now() + msduration
                                }
                            }, (error, res) => {
                                if (error || res.value == null) {

                                    let newMute = {
                                        user: user.id,
                                        server: user.guild.id,
                                        duration: Date.now() + msduration
                                    }
                                    mutecol.insertOne(newMute, (er, result) => {
                                        if (!er) {
                                            user.addRole(mutrole).then(() => {
                                                embed.setColor(0x00ff00)
                                                    .addField('User', user, true)
                                                    .addField('Moderator', msg.member, true)
                                                    .addField('Duration', ms(msduration,{long: true}))
                                                    .setImage('http://mrwgifs.com/wp-content/uploads/2014/12/Gru-Tells-Agnes-To-Zip-It-In-Despicable-Me-2-Gif.gif')
                                                msg.embed(embed).then(message => message.delete(10000))
                                            })

                                        } else {
                                            embed.setColor("RED")
                                                .setDescription(`Couldn't mute ${user}, sorry. :sob:`)
                                            msg.embed(embed).then(message => message.delete(10000))
                                        }
                                    })
                                } else {
                                    user.addRole(mutrole).then(() => {
                                        embed.setColor(0x00ff00)
                                            .addField('User', user, true)
                                            .addField('Moderator', msg.member, true)
                                            .addField('Duration', ms(msduration, {long: true}))
                                            .setImage('http://mrwgifs.com/wp-content/uploads/2014/12/Gru-Tells-Agnes-To-Zip-It-In-Despicable-Me-2-Gif.gif')
                                        msg.embed(embed).then(message => message.delete(10000))
                                    })
                                }
                            })
                        }
                    })
        } else {
            var mutname = "Muted";
            var mutcolor = "BLACK";
            var mutperms = [
                "READ_MESSAGES"
            ];
            
            msg.guild.createRole({
                    name: mutname,
                    color: mutcolor,
                    permissions: mutperms
                })
                .then(role => {
                    console.log(`Created new role with name ${role.name} and color ${role.color}`);
                    mutrole = role;
                    mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
                        useNewUrlParser: true
                    }, (err, dbo) => {
                        if (!err) {
                            let db = dbo.db('trendy')
                            let mutecol = db.collection('mutes')
                            mutecol.findOneAndUpdate({
                                user: user.id,
                                server: user.guild.id
                            }, {
                                $set: {
                                    duration: Date.now() + msduration
                                }
                            }, (error, res) => {
                                if (error || res.value == null) {

                                    let newMute = {
                                        user: user.id,
                                        server: user.guild.id,
                                        duration: Date.now() + msduration
                                    }
                                    mutecol.insertOne(newMute, (er, result) => {
                                        if (!er) {
                                            user.addRole(mutrole).then(() => {
                                                embed.setColor(0x00ff00)
                                                    .addField('User', user, true)
                                                    .addField('Moderator', msg.member, true)
                                                    .addField('Duration', ms(msduration,{long: true}))
                                                    .setImage('http://mrwgifs.com/wp-content/uploads/2014/12/Gru-Tells-Agnes-To-Zip-It-In-Despicable-Me-2-Gif.gif')
                                                    user.send(`You have been muted in **${user.guild}** by \`${msg.member.displayName}\` for **${ms(msduration,{long:true})}**.`).then(()=>{
                                                        msg.embed(embed).then(message => message.delete(10000))
                                                    })
                                                
                                            })

                                        } else {
                                            embed.setColor("RED")
                                                .setDescription(`Couldn't mute ${user}, sorry. :sob:`)
                                            msg.embed(embed).then(message => message.delete(10000))
                                        }
                                    })
                                } else {
                                    user.addRole(mutrole).then(() => {
                                        embed.setColor(0x00ff00)
                                            .addField('User', user, true)
                                            .addField('Moderator', msg.member, true)
                                            .addField('Duration', ms(msduration,{long: true}))
                                            .setImage('http://mrwgifs.com/wp-content/uploads/2014/12/Gru-Tells-Agnes-To-Zip-It-In-Despicable-Me-2-Gif.gif')
                                        msg.embed(embed).then(message => message.delete(10000))
                                    })
                                }
                            })
                        }
                    })

                })
                .catch(() => {
                    return msg.reply(`There was no \`muted\` role neither could I create one.`);
                });
        }
        msg.delete(10000);
    }

}

module.exports = muteCommand;