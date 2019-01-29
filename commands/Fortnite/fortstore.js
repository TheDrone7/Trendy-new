const {
    Command
} = require('discord.js-commando')
const discord = require('discord.js')
const request = require('request')
const config = require('../../config')

var fortopts = {
    url: "",
    headers: {
        'TRN-Api-Key': config.fortApiKey
    }
}

class storeCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'fortstore',
            memberName: 'fortstore',
            group: 'fort',
            description: 'Shows the fortnite store.',
            details: 'Shows the daily fortnite store (and also more details if u want to search for them)',
            aliases: ['fortstores', 'fortnite-store', 'fort-store'],
            examples: ['..fortstore']
        })
    }

    run(msg) {
        fortopts.url = "https://api.fortnitetracker.com/v1/store/";
        request(fortopts, (error, res, body) => {
            if (!error && res.statusCode == "200") {

                let stitems = JSON.parse(body)
							let itembed = new discord.RichEmbed();
							itembed.setTitle("Store")
							itembed.setThumbnail("https://banner2.kisspng.com/20180828/kba/kisspng-fortnite-battle-royale-video-games-clip-art-battle-5b8581d2e693f2.2860033415354761789445.jpg")
							itembed.setColor("BLUE")
							let desc = "The Store contains the follwing items: -\n\n"
							let n = 1
							stitems.forEach(it=>{				
								desc += n.toString() + ". " + it.name + " - Cost: " + it.vBucks + " V-Bucks\n"
								n++;
							})
							itembed.setDescription(desc)
							itembed.setFooter("This is today's fortnite store.")
							msg.embed(itembed).then(message=>{
								message.channel.send("Enter the number of a specific item to view more details.\nYou can also say `cancel` for me to stop.")
								let mc = new discord.MessageCollector(msg.channel,m=> m.author.id == msg.author.id,{max:1})
								mc.on("collect",esg=>{
                                    
                                    let up = esg.content.trim().toLowerCase();

                                    if(isNaN(up)){
                                        if(up.indexOf('cancel') > -1){
                                            esg.react('☑')
                                        }
                                        else{
                                            msg.say('Command cancelled').then(gg=>gg.react('☑'))
                                        }
                                    }
                                    else{
                                        let nu = parseInt(up)
                                        if(nu > stitems.length){
                                            message.channel.send("Invalid Choice, c ya later.")
                                        }
                                        else{
                                            nu--;
                                            let itemembed = new discord.RichEmbed();
                                            itemembed.setTitle(stitems[nu].name)
                                            itemembed.setColor("BLUE")
                                            itemembed.setThumbnail("https://banner2.kisspng.com/20180828/kba/kisspng-fortnite-battle-royale-video-games-clip-art-battle-5b8581d2e693f2.2860033415354761789445.jpg")
                                            itemembed.addField("Rarity",stitems[nu].rarity,true)
                                            itemembed.addField("Cost",stitems[nu].vBucks,true)
                                            itemembed.setImage(stitems[nu].imageUrl);
                                            esg.channel.send(itemembed);
                                        }
                                    }  
								})
							})

            } else {
                msg.say("Error:" + err + "\nStatus Code: " + res.statusCode)
                msg.say("You ran into an error, contact the dev by joining the support server for more info.")
            }
        });

    }

}

module.exports = storeCommand