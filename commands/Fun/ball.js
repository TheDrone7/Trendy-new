const {
    Command
} = require('discord.js-commando')
const discord = require('discord.js')

var balls = [
    "***Yes!***",
    "**No Way!**",
    "*Maybe or Maybe not... xd*",
    "**Are you even Serious?**",
    "*Probably...*",
    "*I don't think so...*"
];

class ballCommand extends Command {

    constructor(client) {
        super(client, {
            name: '8ball',
            memberName: '8ball',
            group: 'fun',
            description: 'Sends a random reply.',
            details: 'Sends a random reply to your *yes/no* question.',
            examples: ['=8ball should I leave?','=8ball is he stewpied?'],
            args: [{
                key: 'ques',
                prompt: 'What is your question child?\n',
                type: 'string'
            }]
        })
    }

    run(msg, {
        ques
    }) {
        if (ques) {
            msg.say(balls[Math.floor(Math.random() * balls.length)])
        }
    }
}

module.exports = ballCommand