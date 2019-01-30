const {Command} = require('discord.js-commando')
const discord = require('discord.js')

class suggestCommand extends Command{

    constructor(client){
        super(client,{
            name: 'suggest',
            memberName: 'suggest',
            group: 'support',
            description: 'Suggest a new feature for the bot to the dev.',
            details: 'Notify the developer of a feature that you would like to see in me.',
            examples: ['..suggest add a meme command.'],
            args: [{
                key:'suggestion',
                type: 'string',
                prompt: 'What would u like to suggest?'
            }],
            throttling: {
                duration: 300,
                usages: 1
            }
        })
    }

    run(msg, {suggestion}){
        let embed = new discord.RichEmbed()
        embed.setTitle('Suggestion')
        .setColor('GREEN').setTimestamp().setThumbnail(msg.author.avatarURL)
        .addField('User',msg.author.username,true).addField('Server',msg.guild.name || "DMs", true)
        .addField('Suggestion',suggestion)
        this.client.channels.get('540076804157734912').send(embed).then(()=>{
            msg.react('☑')
            msg.reply('Suggestion submitted')
        })
    }

}

module.exports = suggestCommand