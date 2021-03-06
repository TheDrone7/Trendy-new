const discord = require('discord.js')
const {Command} = require('discord.js-commando')
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class warningCommand extends Command{

    constructor(client){
        super(client, {
            name: 'warnings',
            memberName: 'warnings',
            group: 'moderation',
            aliases:['warning'],
            guildOnly: true,
            description: 'Shows the warnings given to the user.',
            details: 'Displays the "*criminal record*" of the @mentioned-user.',
            userPermissions: ['KICK_MEMBERS'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Whose warnings would u like to see?'
            }],
            examples: ['=warning @HS','=warnings @HS']
        })
    }

    run(msg, {user}){
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true},(err, dbo)=>{
            let db = dbo.db('trendy')
            let warncol = db.collection('warnings')
            let embed = new discord.RichEmbed()
            embed.setTitle(`Warnings List of ${user.displayName}`)
            .setFooter("As of ",this.client.user.avatarURL)
            .setTimestamp()
            .setThumbnail(this.client.user.avatarURL)
            warncol.find({'user':user.id,'server':msg.guild.id},{sort: {time: 1}}).toArray().then(warnlist=>{
                if(warnlist.length > 0){
                    let i = 1
                    embed.addBlankField().addBlankField(true)
                    warnlist.forEach(warn=>{
                        embed.addField(i.toString()+") By:    " + warn.mod, "\n**Reason** :    *" + warn.reason +"*")
                        embed.addBlankField()
                        i++
                    })
                    embed.setColor("RED")
                }
                else{
                    embed.setDescription("The user currently has no warnings")
                    embed.setColor(0x00ff00)
                }
                msg.embed(embed)
            })
        })
    }

}

module.exports = warningCommand