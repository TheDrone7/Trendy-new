let { Command } = require('discord.js-commando')
let discord = require('discord.js')

class infoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            memberName: 'info',
            description: 'Gets the bot\'s info.',
            details: 'Shows the bot\'s basic information to the user via DMs.',
            examples: ['=info'],
            group: 'general'
        })
    }

    async run(msg) {
        let embed = new discord.RichEmbed();
        embed.setTitle("INFO");
        embed.setThumbnail(this.client.user.avatarURL);
        embed.addField("About ME", "Hi! I am a bot created by ** :pisces:S#1624 ** and the founder is ** Amir **, I have some fun commands and mod commands! Thank you for inviting me to your server, and if regard of anymore info or report join the following link, talk to the creator and he shall fix it.");
        embed.addField("Support Server", "https://discord.gg/hjC7k6Y");
        embed.addField("Help","Use `" + this.client.commandPrefix + "help` command in any server or simply `help` command in DMs to see a list of commands");
        embed.setColor(0x00ff00)
        try{
            await msg.direct(embed)
            if(msg.channel.type !== 'dm'){
                let msgToDel = await msg.say("Sent you a DM, make sure to check it out. :wink:")
                await msgToDel.delete(5000)
            } 
        }
        catch(er){
            await msg.reply('Unable to send you the info, make sure you accept DMs.')
        }
        finally{
            return null
        }
    }
}

module.exports = infoCommand