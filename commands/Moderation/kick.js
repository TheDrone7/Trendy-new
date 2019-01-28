const discord = require('discord.js')
const { Command } = require('discord.js-commando');
const missingPerms = require('./perms')

class kickCommand extends Command{

    constructor(client){
        super(client, {
            name: 'kick',
            memberName: 'kick',
            group: 'moderation',
            description: 'Kicks an user from the server.',
            details: 'Kicks the @mentioned-user from the server where the command is used. Also notifies the member',
            guildOnly: true,
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            examples: ['..kick @HS','..kick @HS for being a liar.'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to kick?'
            },{
                key: 'reas',
                type: 'string',
                prompt: 'Why would you want to kick them?',
                default: 'for no specific reason.'
            }]
        })
    }

    async run(msg, {user, reas}){
            await user.user.send(`You were kicked from ***${msg.guild.name}*** by \`${msg.member.displayName}\` - ${reas}`).catch(()=>{console.log("Error")})
            user.kick(reas).then(mem=>{
                let embed = new discord.RichEmbed({
                    title: `Kicks ${user.user.username} - ${reas}`,
                    footer: {text:'Kicked', icon_url: this.client.user.avatarURL},
                    image: {url: "https://media.giphy.com/media/qiiimDJtLj4XK/giphy.gif"}
                })
                embed.setTimestamp().setAuthor(msg.member.displayName,msg.member.user.avatarURL)
                msg.embed(embed).then(mess=>{mess.delete(60000)})
            }).catch(()=>{
                return msg.reply(missingPerms.message)
            })
            msg.delete(10000)
    }

}

module.exports = kickCommand