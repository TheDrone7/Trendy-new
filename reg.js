const discord = require('discord.js')
const config = require('./config')
const mongo = require('mongodb')


const bot = new discord.Client()

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

        bot.on('ready',()=>{
            bot.guilds.forEach(guild=>{
                guild.members.filter(mem=>mem.user.bot == false).forEach(mem=>{
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
                })
            })
        })

    }
});

bot.login(config.token)