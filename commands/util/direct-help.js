const {
    Command
} = require('discord.js-commando')
const {
    stripIndents,
    oneLine
} = require('common-tags')
const discord = require('discord.js')
const disambiguation = (items, label, property = 'name') => {
    const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
    return `Multiple ${label} found, please be more specific: ${itemList}`;
}

class dhelpCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'direct-help',
            group: 'util',
            memberName: 'direct-help',
            aliases: ['direct-commands','dhelp'],
            description: 'Displays a list of available categories/commands, or detailed information for a specified command via DMs.',
            details: `
				The command may be part of a command name or group name or a whole command name or group name.
				If it isn't specified, all available commands will be listed.
			`,
            examples: ['direct-help', 'direct-help prefix'],
            guarded: true,
            args: [{
                key: 'command',
                prompt: 'Which command would you like to view the help for?',
                type: 'string',
                default: ''
            }]
        });
    }

    async run(msg, args) { // eslint-disable-line complexity
            const groups = this.client.registry.groups;
            const commands = this.client.registry.findCommands(args.command, false, msg);
            const matchedGroups = this.client.registry.findGroups(args.command, false);
            const showAll = args.command && args.command.toLowerCase() === 'all';
            if (args.command && !showAll) {
                if (commands.length === 1) {
                    let helpEmbed = new discord.RichEmbed({footer: {icon_url: this.client.user.avatarURL, text: `Requested by: ${msg.guild? msg.member.displayName : msg.author.username} `}})
                    helpEmbed.setTitle(`Command: ${commands[0].name}`).setColor("RANDOM").setTimestamp()
                        .addField('Format', msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`))
                        .addBlankField()
                    if (commands[0].guildOnly) helpEmbed.addField('Only usable in servers?', commands[0].guildOnly ? 'Yes' : 'No').addBlankField()
                    if (commands[0].aliases.length > 0) helpEmbed.addField('Aliases', `\`${commands[0].aliases.join('\`, \`')}\``).addBlankField()
                    if(commands[0].details) helpEmbed.addField('Details',`${commands[0].details}`).addBlankField()
                    if(commands[0].examples) helpEmbed.addField('Examples',`\`\`\`${commands[0].examples.join('\`\`\`\`\`\`')}\`\`\``).addBlankField()
                    helpEmbed.fields.pop()
				    const messages = [];
				    try {
					    messages.push(await msg.author.send(helpEmbed));
				    } catch(err) {
					    messages.push(await msg.reply('Unable to send you the help I could and I have no idea why... :cry:'));
				    }
				    return messages;
			    } else if(commands.length > 15) {
				    return msg.reply('Multiple commands found. Please be more specific.');
			    } else if(commands.length > 1) {
				    return msg.reply(disambiguation(commands, 'commands'));
			    }
                else if (matchedGroups.length === 1) {
                    let helpEmbed = new discord.RichEmbed({footer: {icon_url: this.client.user.avatarURL, text: `Requested by: ${msg.guild? msg.member.displayName : msg.author.username} `}})
                    helpEmbed.setTitle(`Group: ${matchedGroups[0].name}`).setColor("RANDOM").setTimestamp()
                    .setThumbnail(this.client.user.avatarURL)

                    let grp = matchedGroups[0]

                    helpEmbed.addBlankField()
                    let commandArray = showAll ? grp.commands.array() : grp.commands.filter(cmd => cmd.isUsable(msg)).array()
                    commandArray.forEach(cmd=>{
                    helpEmbed.addField(cmd.name,cmd.description).addBlankField()
                    })
                
                    const messages = [];
                    try {
                        messages.push(await msg.author.send(helpEmbed));
                    } catch(err) {
                        messages.push(await msg.reply('Unable to send you the help I could and I have no idea why... :cry:'));
                    }
                    return messages;
                }
                else if(matchedGroups.length > 1) {
                    return msg.reply(disambiguation(matchedGroups, 'Groups'));
                }
                else {
                    return msg.reply(
                        `Unable to identify command. Use ${msg.usage(
                            null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
                        )} to view the list of all commands.`
                    );
                }
            } else {
                const messages = [];
                
                try{
                    let helpEmbed = new discord.RichEmbed({footer: {icon_url: this.client.user.avatarURL, text: `Requested by: ${msg.guild? msg.member.displayName : msg.author.username} `}})
                    helpEmbed.setTitle(showAll ? 'All command groups' : `
                                Available command groups in ${
                                    msg.guild || 'this DM'
                                }
                                `)
                    .setColor("RANDOM").setTimestamp().setThumbnail(this.client.user.avatarURL)
                    let help = `
                                ${
                                    (showAll ? groups : groups.filter(grp => grp.id.toLowerCase() != 'commands' && grp.commands.some(cmd => cmd.isUsable(msg))))
                                    .map(grp => stripIndents`
                                        \`\`\`${grp.name}\`\`\`
                                    `).join('')
                                }\n\n
                                You can use \`=help <group-name>\` to list all commands under that group.\n
                                You can also use \`=help <command-name>\` for more details on that command.\n\n
                                **Note:** *To use a command in DMs, you don't need to use the prefix, simply use \`<command>\` in DMs.*\n\n
                                `
                    helpEmbed.setDescription(help)
                    messages.push(await msg.author.send(helpEmbed))
                }
                catch(err) {
                    messages.push(await msg.reply('Unable to send you the help I could and I have no idea why... :cry:.'));
                }
                return messages;
            }
	}

}

module.exports = dhelpCommand