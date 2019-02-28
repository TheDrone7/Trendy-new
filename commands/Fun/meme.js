const commmando = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

function getmeme(){
    return "http://images.memes.com/meme/" + Math.floor(Math.random() * 32000).toString() + ".jpg"
}

class memeCommand extends commmando.Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: ['memes', 'm', ],
            description: 'Displays a meme.',
            memberName: 'meme',
            examples: ['=meme', '=memes','=m'],
            group: 'fun',
            details: 'Gets a random meme from https://memes.com/ and shows it to you.'
        })
    }

    run(msg){
        let embed = new RichEmbed()
        embed.setColor("RANDOM")
        embed.setImage(getmeme())
        if(msg.guild.id == "437048931827056642")
            return msg.channel.send(`${msg.author}, the \`meme\` command has been disabled.`)
        else
            return msg.embed(embed)
    }

}

module.exports = memeCommand