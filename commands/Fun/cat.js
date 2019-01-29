const discord = require('discord.js')
const random = require('pkg-random')
const {Command}  = require('discord.js-commando')
const request = require('request')
const {catApiKey} = require('../../config')

let reqOpts = {
    url: 'https://api.thecatapi.com/v1/',
    headers: {
        'x-api-key': catApiKey
    }
}

class catCommand extends Command{

    constructor(client){
        super(client,{
            name: 'cat',
            memberName: 'cat',
            aliases: ['cats'],
            group: 'fun',
            description: 'Shows a cat image.',
            details: 'Gets a random cat, shows it\'s details.',
            examples: ['..cat'],
            throttling: {duration: 5,usages: 2}
        })
    }

    run(msg){
        reqOpts.url = "https://api.thecatapi.com/v1/breeds/"
        request(reqOpts,(err, res, body)=>{
            if(!err && res.statusCode=="200"){
                let breeds = JSON.parse(body.toString())
                reqOpts.url = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + random.choice(breeds).id
                request(reqOpts,(error, resp, b)=>{
                    if(!error && resp.statusCode == "200"){
                        let rC = JSON.parse(b.toString())
                        let embed = new discord.RichEmbed()
                        embed.setTitle('Cat').setThumbnail(this.client.user.avatarURL).setTimestamp()
                        embed.addField("Breed",rC[0].breeds[0].name, true)
                        .addField('Origin',rC[0]["breeds"][0].origin, true)
                        .addField('Description',rC[0]["breeds"][0].description)
                        .setImage(rC[0].url)
                        .setColor("RANDOM")
                        if(msg.guild)
                            embed.setFooter(`Requested by: ${msg.member.displayName} `)
                        else embed.setFooter(`Requested by: ${msg.author.username} `)
                        msg.embed(embed)
                    }
                })
            }
            else{
                console.log(`Status Code: ${res.statusCode}\n\nerr: ${err}`)
            }
        })
    }
}

module.exports = catCommand