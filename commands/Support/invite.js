const {Command} = require('discord.js-commando')

class inviteCommand extends Command{

    constructor(client){
        super(client, {
            name: 'invite',
            memberName: 'invite',
            group: 'support',
            description: 'Get an invite link.',
            details: 'Get an invite link to invite the bot to your own server',
        })
    }

    run(msg){
        return msg.reply(" here's the link: -\nhttps://discordapp.com/oauth2/authorize?client_id=442661706083205140&scope=bot&permissions=8")
    }

}

module.exports = inviteCommand