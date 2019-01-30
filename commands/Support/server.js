const {Command} = require('discord.js-commando')

class serverCommand extends Command{

    constructor(client){
        super(client, {
            name: 'server',
            memberName: 'server',
            aliases: ['server','server'],
            group: 'support',
            description: 'Get an link to support server.',
            details: 'Get a link to the bot\'s support server.'
        })
    }

    run(msg){
        return msg.reply(" here's the link: -\nhttps://discord.gg/zggcZbJ")
    }

}

module.exports = serverCommand