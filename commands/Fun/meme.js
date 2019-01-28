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
            examples: ['..meme', '..memes','..m'],
            group: 'fun',
            details: 'Gets a random meme from https://memes.com/ and shows it to you.'
        })
    }

    run(msg){
        let embed = new RichEmbed()
        embed.setColor("RANDOM")
        embed.setImage(getmeme())
        return msg.embed(embed)
    }

}

module.exports = memeCommand