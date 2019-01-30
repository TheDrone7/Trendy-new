const {Command} = require('discord.js-commando')
const discord = require('discord.js')
const mongo = require('mongodb')
const config = require('../../config')

class welCommand extends Command{

    constructor(client){
        super(client,{
            name: 'welcome',
            memberName: 'welcome',
            group: 'jl',
            aliases: ['wel','welcome-message','welcome-msg','wlcm-msg'],
            description: 'Sets the welcome message.',
            details: 'Sets the message to be sent to welcome a new user.\nUse \`{server}\` where you want the server name and \`{user}\` where you want the new-user name.\nThe default message is: -\n\nHello {user} and welcome to {server}.\nPlease enjoy your stay! :smile:',
            examples: ['=welcome Welcome to {server}, {user}.'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [{
                key: 'message',
                type: 'string',
                prompt: 'What would you like the new welcome message to be?'
            }]
        })
    }

    run(msg, {message}){
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true},(error, dbo)=>{
            if(!error){
                let db = dbo.db('trendy')
                let servcol = db.collection('servdata')
                servcol.updateOne({'_id':msg.guild.id},{$set: {'welcome': message}},(err,res)=>{
                    if(!err){
                        let embed = new discord.RichEmbed()
                        embed.setTitle('Welcome Message').setColor('GREEN').setAuthor(msg.member.displayName,msg.author.avatarURL)
                        .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                        .addField('Status', 'Success').addField('New Message',message)
                        msg.embed(embed)
                    }
                    else{
                        let embed = new discord.RichEmbed()
                        embed.setTitle('Welcome Message').setColor('RED').setAuthor(msg.member.displayName,msg.author.avatarURL)
                        .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                        .addField('Status', 'Failed').addField('Error','Unable to set the new message.')
                        msg.embed(embed)
                    }
                })
            }
            else{
                let embed = new discord.RichEmbed()
                embed.setTitle('Welcome Message').setColor('RED').setAuthor(msg.member.displayName,msg.author.avatarURL)
                .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                .addField('Status', 'Failed').addField('Message','Unable to connect to database.')
                msg.embed(embed)
            }
        });
    }

}

module.exports = welCommand