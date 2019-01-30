const {Command} = require('discord.js-commando')

class webCommand extends Command{

    constructor(client){
        super(client, {
            name: 'site',
            memberName: 'site',
            aliases: ['website','web'],
            group: 'support',
            description: 'Get an link to the website.',
            details: 'Get a link to the bot\'s website.'
        })
    }

    run(msg){
        return msg.reply(" here's the link: -\nhttp://trendy-bot.net16.net")
    }

}

module.exports = webCommand