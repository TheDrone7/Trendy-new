const discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
const mongo = require('mongodb');
const ms = require('ms')
const config = require('../../config')

class unmuteCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'unmute',
            memberName: 'unmute',
            group: 'moderation',
            description: 'Unmutes an user in the server.',
            details: 'Unmtes the @mentioned-user in the server where the command is used.',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['BAN_MEMBERS'],
            examples: ['..mute @HS', '..mute @HS 2 days.'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to ban?'
            }]
        });
    }

    async run(msg, {
        user
    }) {
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
            useNewUrlParser: true
        }, function (err, db) {
            if (err) {
                console.error
            } else {
                let dbo = db.db('trendy')
                let muterole = msg.guild.roles.filter(role => role.name.toLowerCase().indexOf("muted") > -1).array()[0]
                let mutecol = dbo.collection('mutes')
                mutecol.findOneAndDelete({user: user.id, server: msg.guild.id},(error, res)=>{
                    if(error) console.log(error)
                    else {
                        if(res.value == null){
                            msg.reply(" the user wasn't even muted. 00f.")
                        }
                        else{
                            user.removeRole(muterole).then(()=>{
                                msg.say(`${user} was unmuted by **${msg.member.displayName}** \`${ms(res.value.duration-Date.now(),{long:true})}\` earlier than it was supposed to happen!`).then(message=>{
                                    message.delete(10000)
                                    user.send(`You have been unmuted in the server **${msg.guild}**.`)
                                })
                            })
                        }
                    }
                })
            }
        })

        msg.delete(10000);
    }

}

module.exports = unmuteCommand;