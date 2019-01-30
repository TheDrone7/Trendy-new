const discord = require('discord.js')
const { Command } = require('discord.js-commando');
const missingPerms = require('./perms')

class banCommand extends Command{

    constructor(client){
        super(client, {
            name: 'ban',
            memberName: 'ban',
            group: 'moderation',
            description: 'Bans an user from the server.',
            details: 'Bans the @mentioned-user from the server where the command is used. Also notifies the member',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            examples: ['=ban @HS','=ban @HS for being a liar.'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to ban?'
            },{
                key: 'reas',
                type: 'string',
                prompt: 'Why would you want to ban them?',
                default: 'for no specific reason.'
            }]
        })
    }

    async run(msg, {user, reas}){
            await user.user.send(`You were banned from ***${msg.guild.name}*** by \`${msg.member.displayName}\` - ${reas}`).catch(()=>{console.log("Error")})
            user.ban(reas).then(mem=>{
                let embed = new discord.RichEmbed({
                    title: `Bans ${user.user.username} - ${reas}`,
                    footer: {text:'Banned', icon_url: this.client.user.avatarURL},
                    image: {url: "https://media.giphy.com/media/1Nclw5CJ3N77G/giphy.gif"}
                })
                embed.setTimestamp().setAuthor(msg.member.displayName,msg.member.user.avatarURL)
                msg.embed(embed).then(mess=>{mess.delete(60000)})
            }).catch(()=>{
                return msg.reply(missingPerms.message)
            })
            msg.delete(10000)
    }

}

module.exports = banCommand