const {Command} = require('discord.js-commando')
const dblapi = require('dblapi.js')
const config = require('../../config')

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
        let dbl = new dblapi(config.dblApiKey, this.client)
        dbl.hasVoted(msg.author.id).then(voted=>{
            if(!voted) return msg.reply(" here's the link: -\nhttps://discordbots.org/bot/442661706083205140/vote")
            else return msg.reply(" You've already voted! Thank you :smile:")
        })
        
    }

}

module.exports = voteCommand