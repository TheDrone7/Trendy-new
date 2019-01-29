const discord = require('discord.js')
const {Command} =require('discord.js-commando')

class clearCommand extends Command{

    constructor(client){
        super(client,{
            name: 'clear',
            memberName: 'clear',
            group: 'moderation',
            examples: ['..clear 20','..clear'],
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS','MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS','MANAGE_MESSAGES'],
            autoAliases: true,
            description: 'Clears messages in the channel',
            details: 'Clears the specified number of messages in the channel (100 by default).',
            args: [{
                key: 'no',
                type: 'integer',
                prompt: 'How many messages would you like to delete?',
                default: 100
            }]
        })
    }

    run(msg, {no}){

        if(no > 0 && no < 101){
            msg.channel.bulkDelete(no).then(msgs=>msg.reply(` deleted ${msgs.size} messages in ${msg.channel}`).then(mesg=>mesg.delete(10000)))
        }
        else{
            msg.reply(' invalid number of messages specified.')
        }

    }

}

module.exports = clearCommand