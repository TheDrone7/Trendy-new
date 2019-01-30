const discord = require('discord.js')
const {
    Command
} = require('discord.js-commando')

class sayCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'say',
            memberName: 'say',
            description: 'Says what you asked for.',
            details: 'Repeats whatever you say.',
            args: [{
                key: 'text',
                prompt: 'What do you want me to say child?\n',
                type: 'string'
            }],
            group: 'fun',
            examples: ['=say Hello', '=say text', '=say you should probably die.'],
            userPermissions:['MANAGE_GUILD','MANAGE_MESSAGES']
        })
    }

    run(msg, {
        text
    }) {
        if (text) {
            msg.delete()
            return msg.say(`**${text}**`)
        }
    }

}

module.exports = sayCommand