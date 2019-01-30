const {Command} = require('discord.js-commando')

class voteCommand extends Command{

    constructor(client){
        super(client, {
            name: 'vote',
            memberName: 'vote',
            group: 'support',
            description: 'Upvote the bot.',
            details: 'Get the link to Upvote the bot in discord bots list.',
            examples: ['=vote']
        })
    }

    run(msg){
        return msg.reply(" here's the link: -\nhttps://discordbots.org/bot/442661706083205140/vote")
    }

}

module.exports = voteCommand