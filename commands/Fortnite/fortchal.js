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

class chalCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'fortchal',
            memberName: 'fortchal',
            group: 'fort',
            description: 'Shows the fortnite challenges.',
            details: 'Shows the list of daily fortnite challenges (and also more details if u want to search for them)',
            aliases: ['fortchals', 'fortnite-challenge', 'fort-challenges', 'fortnite-challenges'],
            examples: ['..fortchal']
        })
    }

    run(msg) {
        fortopts.url = "https://api.fortnitetracker.com/v1/challenges/";
        request(fortopts, (error, res, body) => {
            if (!error && res.statusCode == "200") {
                let chal = "The currently active challenges are: -\n\n"
                let challist = JSON.parse(body);
                let n = 1;
                challist.items.forEach(challenge => {
                    chal += `${n.toString()}. ${challenge.metadata[1].value}(${challenge.metadata[3].value})\n`
                    n++;
                })
                let challengeembed = new discord.RichEmbed();
                challengeembed.setTitle("Active Fortnite Challenges")
                challengeembed.setColor("RED")
                challengeembed.setThumbnail("https://banner2.kisspng.com/20180828/kba/kisspng-fortnite-battle-royale-video-games-clip-art-battle-5b8581d2e693f2.2860033415354761789445.jpg")
                challengeembed.setDescription(chal)
                if(msg.guild)
                    challengeembed.setFooter("Requested by: " + msg.member.displayName);
                else
                    challengeembed.setFooter("Requested by: " + msg.author.username);
                msg.channel.send(challengeembed).then(message => {
                    message.channel.send("Please enter a number of challenge to get more details.\nYou can also say `cancel` or anything else for me to stop.")
                    let mc = new discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, {
                        max: 1
                    })
                    mc.on("collect", esg => {
                        let up = esg.content.trim().toLowerCase();

                        if (isNaN(up)) {
                            if (up.indexOf('cancel') > -1) {
                                esg.react('☑')
                            } else {
                                msg.say('Command cancelled').then(gg => gg.react('☑'))
                            }
                        } else {
                            let nu = parseInt(esg.content.trim());
                            if (nu > challist.length) {
                                esg.channel.send("Invalid choice, c ya later.")
                            } else {
                                nu--;
                                let chalembed = new discord.RichEmbed();
                                chalembed.setTitle(challist.items[nu].metadata[1].value)
                                chalembed.setColor("RED");
                                chalembed.setThumbnail("https://banner2.kisspng.com/20180828/kba/kisspng-fortnite-battle-royale-video-games-clip-art-battle-5b8581d2e693f2.2860033415354761789445.jpg")
                                chalembed.addField("Total times to be done", challist.items[nu].metadata[3].value);
                                chalembed.addField("Reward", `${challist.items[nu].metadata[5].value}X`)
                                chalembed.setImage(challist.items[nu].metadata[4].value);
                                if(msg.guild)
                                    chalembed.setFooter("Requested by: " + msg.member.displayName)
                                else
                                    chalembed.setFooter("Requested by: " + msg.author.username)
                                message.channel.send(chalembed);
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

module.exports = chalCommand