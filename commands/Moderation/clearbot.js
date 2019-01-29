const discord = require('discord.js')
const {Command} =require('discord.js-commando')

class clearbotCommand extends Command{

    constructor(client){
        super(client,{
            name: 'clearbot',
            memberName: 'clearbot',
            group: 'moderation',
            examples: ['..clearbot'],
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS','MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS','MANAGE_MESSAGES'],
            autoAliases: true,
            description: 'Clears bots\' messages.',
            details: 'Deletes messages sent by bots in the channel.'
        })
    }

    run(msg){

        let n = 0
        msg.channel.fetchMessages().then(messages=>{
            messages.filter(mesg=> mesg.author.bot == true).forEach(mesg=>{
                mesg.delete()
                n++
            })
        })
        msg.channel.send("Now deleting messages").then(message=>{
            setTimeout(()=>
            {
                message.edit(`Deleted ${n} messages in ${msg.channel}.`).then(msgs=>{
                    msgs.delete(10000)
                })
            })
        })
        
        

    }

}

module.exports = clearbotCommand