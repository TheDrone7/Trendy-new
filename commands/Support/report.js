const {Command} = require('discord.js-commando')
const discord = require('discord.js')

class reportCommand extends Command{

    constructor(client){
        super(client,{
            name: 'report',
            memberName: 'report',
            group: 'support',
            description: 'Suggest a new feature for the bot to the dev.',
            details: 'Notify the developer of a feature that you would like to see in me.',
            examples: ['..report I keep getting an error on using the \'channel\' command.'],
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
        .setColor('GREEN').setTimestamp().setThumbnail(msg.author.avatarURL)
        .addField('User',msg.author.username,true).addField('Server',msg.guild.name || "DMs", true)
        .addField('Report',report)
        this.client.channels.get('540076804157734912').send(embed).then(()=>{
            msg.react('☑')
            msg.reply('Report submitted')
        })
    }

}

module.exports = reportCommand