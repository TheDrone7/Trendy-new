const {Command} = require('discord.js-commando')
const discord = require('discord.js')

class uiCommand extends Command{

    constructor(client){

        super(client,{
            name:'userinfo',
            memberName: 'userinfo',
            aliases: ['ui'],
            description: 'Shows the user\'s info.',
            details: 'Gathers data about a user and shows it to you.',
            examples: ['=userinfo','=userinfo @Someone#0011'],
            group: 'general',
            guildOnly: true,
            userPermissions: ['KICK_MEMBERS'],
            args: [
                {
                    key: 'user',
                    type: 'member',
                    default: null,
                    prompt: "Whose info do you want to see? Please @mention them."
                }
            ]
        })
    }

    run(msg, {user}){
        let embed = new discord.RichEmbed()
        embed.setColor("RANDOM")
        embed.setTitle("User Info")
        embed.setAuthor(user.displayName, user.user.avatarURL)
        embed.setTimestamp()
        embed.addField("Username",`${user.user.username}#${user.user.discriminator}`, true)
        embed.addField("Current activity", user.presence.game, true)
        embed.addField("Status", user.presence.status.toUpperCase(), true)
        embed.addField("Joined Server On", user.joinedAt.toUTCString(), true)
        embed.addField("Registered Discord Account On", user.user.createdAt.toUTCString(), true)
        embed.addField("Roles", user.roles.array().join(" "))
        embed.setFooter("Above is all you might need to know.", this.client.user.avatarURL)
        return msg.embed(embed, "Here are some details.")
    }

}

module.exports = uiCommand