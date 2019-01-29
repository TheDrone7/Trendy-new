const discord = require('discord.js')
const {Command} = require('discord.js-commando')
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class warnCommand extends Command{

    constructor(client){
        super(client, {
            name: 'warn',
            memberName: 'warn',
            group: 'moderation',
            guildOnly: true,
            description: 'Warns a user for a crime committed.',
            details: 'Warns the @mentioned-user to record his/her *"criminal record"*.',
            userPermissions: ['KICK_MEMBERS'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who do you want to warn?'
            },{
                key: 'reason',
                type: 'string',
                prompt: 'Why would you want to warn them?'
            }],
            examples: ['..warn @HS for being a noob.','..warn @HS for destroying others\' lives.']
        })
    }

    run(msg, {user, reason}){
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true},(err, dbo)=>{
            let db = dbo.db('trendy')
            let warncol = db.collection('warnings')
            let newWarnDoc = {
                'user': user.id,
                'mod': msg.member.displayName,
                'server':msg.guild.id,
                'time': Date.now(),
                'reason':reason
            }
            warncol.insertOne(newWarnDoc,(error, result)=>{
                if(error){
                    msg.reply(" sorry, but I failed to warn the user.\nPlease contact the dev ASAP to get this error fixed.")
                }
                else{
                    let embed = new discord.RichEmbed()
                    embed.setAuthor(msg.member.displayName,msg.author.avatarURL)
                    .setTitle(`Warn`)
                    .addField('User',`\t${user}`, true)
                    .addField('By',`\t${msg.member}`, true)
                    .addField('Reason',`\t${reason}`, true)
                    .setImage('http://bestanimations.com/Signs&Shapes/Hazards/warning-yellow-blinking-sign-animated-gif-3.gif')
                    msg.channel.send(embed).then(message=>{
                        message.react('☑')
                    })
                }
            })
        })
    }

}

module.exports = warnCommand