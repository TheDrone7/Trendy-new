const {Command} = require('discord.js-commando')

class donateCommand extends Command{

    constructor(client){
        super(client, {
            name: 'donate',
            memberName: 'donate',
            group: 'support',
            description: 'Donate the devs',
            details: 'Get the paypal link to donate the developers if you appreciate the work that much.',
        })
    }

    run(msg){
        return msg.reply(" here's the link: -\nhttps://www.paypal.me/TheDrone7")
    }

}

module.exports = donateCommand