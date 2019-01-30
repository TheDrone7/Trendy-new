const {Command} = require('discord.js-commando')
const discord = require('discord.js')
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class afkCommand extends Command{

    constructor(client){

        super(client,{
            name:'afk',
            memberName: 'afk',
            description: 'Sets your status to `afk`',
            details: 'Sets your status to `afk` and notifies about it to anyone who @mentions you (May also provide reason).',
            examples: ['=afk','=afk going to school.'],
            group: 'general',
            guildOnly: true,
            args: [
                {
                    key: 'reason',
                    type: 'string',
                    default: "no reason.",
                    prompt: "But, why are you going afk?"
                }
            ]
        })
    }

    run(msg, {reason}){
        mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true}, (err, data)=>{
            if(err)
                console.error
            else
            {
                let db = data.db('trendy')
                let userCol = db.collection('userdata')
                userCol.updateOne({'_id':msg.author.id}, { $set:{'status':'afk', 'reas': reason}}, function(err, res){
                    if(err)
                        return msg.say("Couldn't set your status to `AFK`")
                    else{
                        let embed = new discord.RichEmbed()
                        embed.setColor("GREEN")
                        embed.setTitle("Status Set!")
                        embed.addField("Name", msg.member.displayName)
                        embed.addField("Status","AFK", true)
                        embed.addField("Reason", reason)
                        return msg.embed(embed)
                    }
                })
            }
        })
    }

}

module.exports = afkCommand