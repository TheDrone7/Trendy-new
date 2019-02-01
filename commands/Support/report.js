const {Command} = require('discord.js-commando')
const discord = require('discord.js')

class reportCommand extends Command{

    constructor(client){
        super(client,{
            name: 'report',
            memberName: 'report',
            group: 'support',
            description: 'Report an issue.',
            details: 'Notify the developer of an issue with the bot.',
            examples: ['=report I keep getting an error on using the \'channel\' command.'],
            args: [{
                key:'report',
                type: 'string',
                prompt: 'What would u like to report?'
            }],
            throttling: {
                duration: 300,
                usages: 1
            }
        })
    }

    run(msg, {report}){
        let embed = new discord.RichEmbed()
        embed.setTitle('Report')
        .setColor('0x00ff00').setTimestamp().setThumbnail(msg.author.avatarURL)
        .addField('User',msg.author.username,true).addField('Server',msg.guild.name || "DMs", true)
        .addField('Report',report)
        this.client.channels.get('540076896499531786').send(embed).then(()=>{
            msg.react('☑')
            msg.reply('Report submitted')
        })
    }

}

module.exports = reportCommand