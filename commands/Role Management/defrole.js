const commando = require('discord.js-commando')
const Command = commando.Command
const mongo = require('mongodb').MongoClient
const config = require('../../config')

class defroleCommand extends Command{

    constructor(client){
        super(client, {
            name: 'defrole',
            memberName: 'defrole',
            group: 'role',
            aliases: ['default-role'],
            examples: ['..defrole @MyRole','..default-role @MyRole'],
            description: 'Sets the default joining role.',
            details: 'Sets the default role given to all members who join the server.',
            guildOnly: true,
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            args: [{
                key: 'role',
                type: 'role',
                prompt: 'Which role would you like to set as the default role?'
            }]
        })
    }

    run(msg, {role}){

        if(role){
            try{
                mongo.connect(`mongodb://${config.dbUser}:${config.dbPass}@ds026658.mlab.com:26658/trendy`,{useNewUrlParser: true}, (err, res)=>{
                    if(!err){
                        if(res)
                        {
                            let db = res.db('trendy')
                            let servercol = db.collection('servdata')
                            servercol.findOneAndUpdate({'_id':msg.guild.id},{$set: {'defrole':role.id}},(err, result)=>{
                                if(err){
                                    return msg.reply(' couldn\'t set the default role. :cry:')
                                }
                                else{
                                    return msg.reply(` default role set to ${role}. \nUsually starts working as it's supposed to in 2 minutes.`)
                                }
                            })
                        }
                    }
                })
            }
            catch(error){
                console.error(error)
            }
        }

    }

}

module.exports = defroleCommand