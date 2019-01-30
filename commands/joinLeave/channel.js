const {Command} = require('discord.js-commando')
const discord = require('discord.js')
const mongo = require('mongodb')
const config = require('../../config')

class chanCommand extends Command{

    constructor(client){
        super(client,{
            name: 'channel',
            memberName: 'channel',
            group: 'jl',
            aliases: ['chan','jl-channel','jl-chan'],
            description: 'Sets the join-leave channel.',
            details: 'Sets the channel where the join-leave messages will be sent.',
            examples: ['..channel #join-leave'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [{
                key: 'channel',
                type: 'channel',
                prompt: 'In which channel would you like to send the join-leave messages?'
            }]
        })
    }

    run(msg, {channel}){
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true},(error, dbo)=>{
            if(!error){
                let db = dbo.db('trendy')
                let servcol = db.collection('servdata')
                servcol.updateOne({'_id':msg.guild.id},{$set: {'channel': channel.id}},(err,res)=>{
                    if(!err){
                        let embed = new discord.RichEmbed()
                        embed.setTitle('Join-Leave Channel').setColor('GREEN').setAuthor(msg.member.displayName,msg.author.avatarURL)
                        .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                        .addField('Status', 'Success').addField('New Channel',channel)
                        msg.embed(embed)
                    }
                    else{
                        let embed = new discord.RichEmbed()
                        embed.setTitle('Join-Leave Channel').setColor('RED').setAuthor(msg.member.displayName,msg.author.avatarURL)
                        .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                        .addField('Status', 'Failed').addField('Error','Unable to set the new channel.')
                        msg.embed(embed)
                    }
                })
            }
            else{
                let embed = new discord.RichEmbed()
                embed.setTitle('Join-Leave Channel').setColor('RED').setAuthor(msg.member.displayName,msg.author.avatarURL)
                .setFooter('Updated ', this.client.user.avatarURL).setTimestamp()
                .addField('Status', 'Failed').addField('Message','Unable to connect to database.')
                msg.embed(embed)
            }
        });
    }

}

module.exports = chanCommand