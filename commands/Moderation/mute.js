// http://mrwgifs.com/wp-content/uploads/2014/12/Gru-Tells-Agnes-To-Zip-It-In-Despicable-Me-2-Gif.gif

const discord = require('discord.js')
const {
    Command
} = require('discord.js-commando');
const missingPerms = require('./perms')

class banCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'ban',
            memberName: 'ban',
            group: 'moderation',
            description: 'Bans an user from the server.',
            details: 'Bans the @mentioned-user from the server where the command is used. Also notifies the member',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['BAN_MEMBERS'],
            examples: ['..ban @HS', '..ban @HS for being a liar.'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to ban?'
            }, {
                key: 'duration',
                type: 'integer',
                prompt: 'For how long would you like to mute them?',
                default: 86400000
            }]
        })
    }

    async run(msg, {
        user,
        duration
    }) {

        let mutrole = null;
        let mutrolelist = msg.guild.roles.filter(role => role.name.toLowerCase().indexOf("muted") > -1).array()
        if (mutrolelist.length > 0) {
            mutrole = mutrolelist[0]
        } else {
            var mutname = "Muted";
            var mutcolor = "BLACK";
            var mutperms = [
                "READ_MESSAGES"
            ];
            message.guild.createRole({
                    name: mutname,
                    color: mutcolor,
                    permissions: mutperms
                })
                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                .catch(() => {
                    msg.reply(`There was no \`muted\` role neither could I create one.`)
                });
        }

        msg.delete(10000)
    }

}

// module.exports = banCommand