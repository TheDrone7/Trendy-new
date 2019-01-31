const { Command } = require('discord.js-commando')
const request = require('request')

class jokeCommand extends Command{

    constructor(client){

        super(client, {
            name: 'joke',
            memberName: 'joke',
            aliases: ['jokes'],
            description: 'Makes a joke.',
            details: 'Makes fun of you.',
            examples: ['=joke','=jokes'],
            group: 'fun',
        })

    }

    run(msg){
        request({url: `https://api.icndb.com/jokes/random/?escape=javascript`},(error, response, body)=>{
            if(!error && response.statusCode == 200){
                var resp = JSON.parse(body)
                if(resp.type == "success"){
                    if(msg.guild)
                        return msg.say(resp.value.joke.toString().replace(/Chuck Norris/g ,msg.member.displayName))
                    else
                        return msg.direct(resp.value.joke.toString().replace(/Chuck Norris/g,msg.author.username))
                }
                else{
                    return msg.say("Couldn't generate joke.")
                }
            }
            else{
                return msg.say("Couldn't generate joke")
            }
        });
    }

}

module.exports = jokeCommand