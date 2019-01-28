const {Command} = require('discord.js-commando')
const discord = require('discord.js')

class siCommand extends Command{

    constructor(client){

        super(client,{
            name:'serverinfo',
            memberName: 'serverinfo',
            aliases: ['si'],
            description: 'Shows the server\'s info.',
            details: 'Gathers data about a server and shows it to you.',
            examples: ['..serverinfo'],
            group: 'general',
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD']
        })
    }

    run(msg){
        let embed = new discord.RichEmbed()
        embed.setColor("RANDOM")
        let server = msg.guild;
        embed.setTitle("Server Info")
        embed.setTimestamp(server.createdTimestamp)
        embed.addField("Name", server.name, true)
        embed.setThumbnail(server.iconURL)
        embed.addField("ID", server.id, true)
        embed.addField("Humans", server.members.filter(mem => mem.user.bot == false).array().length, true)
        embed.addField("Bots", server.members.filter(mem => mem.user.bot == true).array().length, true)
        embed.addField("Channel Categories", server.channels.filter(chan => chan.type == 'category').array().length)
        embed.addField("Text Channels", server.channels.filter(chan => chan.type == 'text').array().length, true)
        embed.addField("Voice Channels", server.channels.filter(chan => chan.type == 'voice').array().length, true)
        embed.addField("Roles", server.roles.filter(rol=> rol.id != server.id).array().join(" "))
        embed.setFooter("Created On ", this.client.user.avatarURL)
        return msg.embed(embed,"Here's what I found...")
    }

}

module.exports = siCommand