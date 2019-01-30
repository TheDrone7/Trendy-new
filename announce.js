const discord = require('discord.js')
const {token} = require('./config')

const bot = new discord.Client()

bot.on('ready',()=>{
    let announcement = new discord.RichEmbed({
        title: 'Announcement',
        thumbnail: bot.user.avatarURL,
    })
    let text = `I've finally been updated guys!!\n\nListed below are some of the new features!\n=> New commands!\n=> Better data management\n=> Improvement in performance\n=> Improvement of old commands\n=> And much more!\n\n\nUse \`=help\` for more help.\n\n You can also use \`=direct-help\` for getting help via DMs.\n\nPlease do check these new things out and thanks for the patience again.`
    announcement.setTimestamp().setDescription(text).setColor("RANDOM")
    bot.channels.filter(chan=> chan.type=='text' && (chan.name.toLowerCase().indexOf('chat') > -1 || chan.name.toLowerCase().indexOf('general') > -1)).forEach(chan=>{
        chan.send(announcement).then(msg=>{
            console.log(`Message sent in ${msg.guild.name}`)
        }).catch(console.error)
    })

})

bot.login(token)