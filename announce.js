const discord = require('discord.js')
const {token} = require('./config')

const bot = new discord.Client()

bot.on('ready',()=>{
    let announcement = new discord.RichEmbed({
        title: 'Announcement',
        thumbnail: bot.user.avatarURL,
    })
    let text = `There's a new update guys!\nHere's a link to my new website: https://Trendy.thedrone7.repl.co.\n\nBe sure to check it out and also, use the \`=suggest\` command or the support webpage on the website to suggest a new feature that you would like to see :smile:\n\nThanks and C ya.`
    announcement.setTimestamp().setDescription(text).setColor("RANDOM")
    bot.channels.filter(chan=> chan.type=='text' && (chan.name.toLowerCase().indexOf('chat') > -1 || chan.name.toLowerCase().indexOf('general') > -1)).forEach(chan=>{
        chan.send(announcement).then(msg=>{
            console.log(`Message sent in ${msg.guild.name}`)
        }).catch(console.error)
    })

})

bot.login(token)