const Commando = require("discord.js-commando");
const {RichEmbed} = require('discord.js')
const path = require('path');
const mongo = require('mongodb').MongoClient
const ms = require('ms')
const sqlite = require('sqlite')
const config = require('./config')
const dblapi = require('dblapi.js')

// Making the Bot
const client = new Commando.CommandoClient({
    owner: '374886124126208000',
    commandPrefix: '=',
    unknownCommandResponse: false
})

const dbl = new dblapi(config.dblApiKey, client)
let commandUsage = 0

// The replies for talking

var hellorep = [
    "Hello there ",
    "Hi ",
    "Hello ",
    "Hey ",
    "Yo "
];

var byerep = [
    "Bye ",
    "Goodbye ",
    "R.I.P. ",
    ":wave: "
];

var wasuprep = [
    "I am fine, Thank You!",
    "Good, How about you?",
    "Waaazzzzuuupppppppp!!"
];

// Dealing with the commands
client.registry
    .registerGroups([
        ['fun', '==>> Fun commands'],
        ['moderation', '==>> Moderation commands'],
        ['general', '==>> General Commands'],
        ['role', '==>> Role Management'],
        ['fort', '==>> Fortnite Commands'],
        ['jl', '==>> Join-Leave Logging'],
        ['support','==>> Support']
    ])
    .registerDefaults()
    .commands.filter(command=> command.name.toLowerCase().indexOf('help') > -1).forEach(helpCommand=>{
        client.registry.unregisterCommand(helpCommand)
    })
    client.registry.registerCommandsIn(path.join(__dirname, 'commands'))


// Setting the settings provider
client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);


// Connecting to database
mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`, {
    useNewUrlParser: true
}, function (err, db) {
    if (err) {
        console.error
    } else {
        let dbo = db.db('trendy')
        let servcol = dbo.collection('servdata')
        let usercol = dbo.collection('userdata')
        let coolcol = dbo.collection('cooldown')
        let mutecol = dbo.collection('mutes')
        let userdata;
        let servdata;
        let cooldata;
        usercol.find().toArray().then(o => {
            userdata = o;
            console.log("Userdata set!")
        })
        servcol.find().toArray().then(o => {
            servrdata = o;
            console.log("Serverdata set!")
        })
        coolcol.find().toArray().then(o => {
            cooldata = o;
            console.log("Cooldowns set!")
        })
        // After Logging in
        client.on('ready', () => {
            client.user.setActivity("=help")

            console.log(client.user.avatarURL)

            client.setInterval(() => {
                usercol.find().toArray().then(o => {
                    userdata = o;
                    console.log("Userdata set!")
                })
                servcol.find().toArray().then(o => {
                    servrdata = o;
                    console.log("Serverdata set!")
                })
                coolcol.find().toArray().then(o => {
                    cooldata = o;
                    console.log("Cooldowns set!")
                })
            }, 120000)

            // Notify the owners if u don't have the perms to send messages
            client.guilds.forEach(guild => {

                var role = guild.me.hasPermission('SEND_MESSAGES')
                if (!role) {
                    try {
                        guild.owner.send('I do not have permissions to send messages in your guild, please fix the permissions.\nThank You. :smile:')
                        console.log(`Sent request to ${guild.name}'s owner.`)
                    } catch (err) {
                        console.log(`Unable to send the request to ${guild.name}'s owner.`)
                    }
                }
            })

            client.setInterval(() => {
                mutecol.find().toArray().then(obj => {
                    obj.forEach(mute => {
                        if (Date.now() > mute.duration) {
                            let muterole = client.guilds.get(mute.server).roles.filter(rol => rol.name.toLowerCase().indexOf("muted") > -1).array()[0]
                            mutecol.deleteOne(mute, (error, result) => {
                                if (error) {
                                    console.error(error)
                                    console.log("error")
                                } else {
                                    if (muterole) {
                                        console.log(muterole.name)
                                        client.guilds.get(mute.server).members.get(mute.user).removeRole(muterole).then(mem => {
                                            mem.send(`You have been unmuted in **${mem.guild.name}**.`).catch(console.error).then(console.log("Unmuted."))
                                        })
                                    }
                                }
                            })
                        }
                    })
                })
            }, 10000)

            // Update guilds and users info
            client.setInterval(() => {

                client.guilds.forEach(guild => {

                    let coolDoc = {
                        '_id': guild.id,
                        'hicool': Date.now(),
                        'bicool': Date.now(),
                        'spcool': Date.now()
                    }
                    coolcol.insertOne(coolDoc, (err, res) => {
                        if (!err) {
                            console.log(`Registered ${guild.name}'s cooldown.`)
                        }
                    })

                    let guildDoc = {
                        '_id': guild.id,
                        'name': guild.name,
                        'talk': 'disable',
                        'defrole': 'disabled',
                        'welcome': 'Hello {user} and welcome to {server}.\nPlease enjoy your stay! :smile:',
                        'leave': 'Goodbye {user} :wave:! :cry:',
                        'channel': 'disabled'
                    }
                    servcol.insertOne(guildDoc, (err, res) => {
                        if (!err) {
                            console.log(`Registered ${guild.name}.`)
                        }
                    })
                })

                dbl.postStats(client.guilds.size)

            }, 300000)
            console.log("Logged in...")
        })

        // After receiving a message
        client.on('message', message => {
            let author = message.author.id
            if (message.author.bot) return

            // Check if the sender was afk, bring him online if yes
            if (message.guild) {
                if (userdata) {
                    let user = userdata.find(obj => obj._id == author)
                    if (user) {
                        if (user.status) {
                            if (user.status.toLowerCase() == 'afk') {
                                usercol.updateOne({
                                    '_id': author
                                }, {
                                    $set: {
                                        'status': 'online',
                                        'reas': ''
                                    }
                                }, (er, data) => {
                                    if (er)
                                        return message.reply(" I was unable to set your status to online.")
                                    else {
                                        return message.reply(" I see you've come back online")
                                    }
                                })
                                userdata[userdata.indexOf(user)].status = 'online'
                                userdata[userdata.indexOf(user)].reas = ''
                            }
                        }
                    }
                }

                // Check if any afk members were @mentioned
                if (message.mentions.members.array().length > 0) {
                    message.mentions.members.forEach(mem => {
                        usercol.findOne({
                            '_id': mem.id
                        }, (err, res) => {
                            if (err)
                                console.error
                            else {
                                if (res) {
                                    console.log(res)
                                    if (res.status) {
                                        console.log(res.status)
                                        if (res.status == 'afk')
                                        {
                                            console.log('afk')
                                            message.reply(` **${mem.displayName}** is afk for **${res.reas}**.`)
                                        }
                                    }
                                } else {
                                    return null
                                }
                            }
                        })
                    })
                }

                // Talking

                let msg = message.content.toLowerCase()

                servcol.findOne({
                    '_id': message.guild.id
                }, (err, data) => {

                    if (!err) {
                        if (data) {
                            if (data.talk == 'enable') {
                                if (cooldata) {
                                    let servercool = cooldata.find(obj => obj._id == message.guild.id)
                                    if (servercool.hicool < Date.now())
                                        if (msg == "hi" || msg == "hello" || msg == "yo" || msg.startsWith("hello ") || msg.startsWith("hi ") || msg == client.user || msg.startsWith("hey") || msg.startsWith("helo") || msg.startsWith("yo ") && message.author != client.user)
                                            message.channel.send(hellorep[Math.floor(Math.random() * hellorep.length)] + message.member.user.username + "!").then(() => {
                                                cooldata[cooldata.indexOf(servercool)].hicool = Date.now() + 300000
                                                coolcol.updateOne({
                                                    '_id': message.guild.id
                                                }, {
                                                    $set: {
                                                        'hicool': Date.now() + 300000
                                                    }
                                                })
                                            })
                                    if (servercool.spcool < Date.now())
                                        if (msg.indexOf("wassup") > -1 || msg.indexOf("wasup") > -1 || msg.indexOf("what's up") > -1)
                                            message.channel.send(wasuprep[Math.floor(Math.random() * wasuprep.length)]).then(() => {
                                                cooldata[cooldata.indexOf(servercool)].spcool = Date.now() + 300000
                                                coolcol.updateOne({
                                                    '_id': message.guild.id
                                                }, {
                                                    $set: {
                                                        'spcool': Date.now() + 300000
                                                    }
                                                })
                                            })
                                    if (servercool.bicool < Date.now())
                                        if (msg.indexOf("bye") > -1 || msg.indexOf("goodbye") > -1 || msg.startsWith(":wave:") || msg.indexOf("gtg") > -1 || msg.indexOf("cya") > -1)
                                            message.channel.send(byerep[Math.floor(Math.random() * byerep.length)] + message.member.user.username + "!").then(() => {
                                                cooldata[cooldata.indexOf(servercool)].bicool = Date.now() + 300000
                                                coolcol.updateOne({
                                                    '_id': message.guild.id
                                                }, {
                                                    $set: {
                                                        'bicool': Date.now() + 300000
                                                    }
                                                })
                                            })
                                }
                            }
                        }
                    }

                })
            }

            // End of talking

            if(message.content === 'sc' && client.isOwner(message.author) && message.channel.type === 'dm'){
                let embed = new RichEmbed({
                    'title':'Status',
                    'color':0x00ffff,
                    'footer': 'As of',
                    'timestamp': Date.now(),
                    'fields':[
                        {name:'Guild count',value:client.guilds.size,inline: true},
                        {name:'Uptime',value: ms(client.uptime), inline: true},
                        {name:'Commands used since last restart',value:commandUsage.toString()},
                        {name:'Pings',value:`\`${client.pings.join('`ms, `')}\`ms`}
                    ]
                })
                usercol.find().toArray().then(arr=>{
                    embed.addField('Number of users in DB',arr.length)
                    .addField('Time taken to complete transaction',`\`${Date.now() - message.createdTimestamp}\`ms`)
                    .setTimestamp()
                    message.author.send(embed)
                })
            }

            //End of on Message
        })

        client.on('guildMemberAdd', (mem) => {

            let memDoc = {
                '_id': mem.id,
                'status': 'online',
                'reas': ''
            }
            usercol.insertOne(memDoc, function (err, res) {
                if (!err) {
                    console.log(`User registered.`)
                }
            })

            servcol.findOne({
                '_id': mem.guild.id
            }, (err, res) => {

                if (!err) {
                    if (res) {
                        if (res.defrole != 'disabled') {
                            try {
                                mem.addRole(mem.guild.roles.get(res.defrole))
                            } catch (err) {
                                console.error
                            }
                        }
                        if (res.channel != 'disabled') {
                            try {
                                let msgToSend = res.welcome.replace('{server}', mem.guild.name).replace('{user}', mem)
                                client.channels.get(res.channel).send(msgToSend)
                            } catch (err) {
                                console.error
                            }
                        }
                    }
                }

            })


        })

        client.on('guildMemberRemove', (mem) => {
            let saveUser = false
            client.guilds.forEach(server => {
                server.members.forEach(member => {
                    if (member && mem)
                        if (mem.id == member.id)
                            saveUser = true

                })
            })

            if (!saveUser) {
                if (mem) {
                    usercol.findOneAndDelete({
                        '_id': mem
                    }, (err, res) => {
                        if (err) console.error
                        else {
                            console.log("Member deleted.")
                        }
                    })
                }
            }

            servcol.findOne({
                '_id': mem.guild.id
            }, (err, res) => {

                if (!err) {
                    if (res) {
                        if (res.channel != 'disabled') {
                            try {
                                let msgToSend = res.leave.replace('{server}', mem.guild.name).replace('{user}', mem.displayName)
                                client.channels.get(res.channel).send(msgToSend)
                            } catch (err) {
                                console.error
                            }
                        }
                    }
                }
            })
        })
    }
})

client.on('commandRun',()=>{
    commandUsage++;
})

client.login(config.token)