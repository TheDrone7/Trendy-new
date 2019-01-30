const {
    Command
} = require('discord.js-commando')
const discord = require('discord.js')
const request = require('request')
const {fortApiKey} = require('../../config')

var fortopts = {
    url: "",
    headers: {
        'TRN-Api-Key': fortApiKey
    }
}

class statsCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'fortstats',
            memberName: 'fortstats',
            group: 'fort',
            description: 'Shows the fortnite stats.',
            details: 'Search for your fortnite stats and share them with others.\nYour stats might not be available, so sorry if that is the case.',
            aliases: ['fortstat', 'fortnite', 'fortnite-stats', 'fort-stats'],
            examples: ['=fortstats', '=forstats pc TheDrone7'],
            args: [{
                key: 'platform',
                prompt: 'Which platform do you play on?',
                type: 'string',
                validate: platform => {
                    if (platform.toLowerCase().indexOf('pc') > -1) {
                        platform = 'pc'
                        return true
                    } else if (platform.toLowerCase().indexOf('ps') > -1) {
                        platform = 'psn'
                        return true
                    } else if (platform.toLowerCase().indexOf('x') > -1) {
                        platform = 'xbl'
                        return true
                    } else {
                        return "Invalid Platform: only ones available are - `PC`/`XBox`/`PS`."
                    }
                }
            }, {
                key: 'epicname',
                prompt: 'What is your epic-nickname?',
                type: 'string'
            }]
        })
    }

    run(msg, {
        platform,
        epicname
    }) {
        if (platform.toLowerCase().indexOf('pc') > -1) {
            platform = 'pc'
        } else if (platform.toLowerCase().indexOf('ps') > -1) {
            platform = 'psn'
        } else if (platform.toLowerCase().indexOf('x') > -1) {
            platform = 'xbl'
        }

        console.log(epicname)
        fortopts.url = "https://api.fortnitetracker.com/v1/profile/" + platform + "/" + epicname.trim();
        request(fortopts, (error, res, body) => {
            if (!error && res.statusCode == "200") {
                let fortstats = JSON.parse(body);
                let fortembed = new discord.RichEmbed();
                fortembed.setTitle(epicname + "'s Stats")
                .setThumbnail("https://banner2.kisspng.com/20180828/kba/kisspng-fortnite-battle-royale-video-games-clip-art-battle-5b8581d2e693f2.2860033415354761789445.jpg")
                .setColor("GREEN")
                if(msg.guild)
                    fortembed.setFooter("Requested by: " + msg.member.displayName+" ",msg.author.avatarURL).setTimestamp();
                else
                    fortembed.setFooter("Requested by: " + msg.author.username+" ",msg.author.avatarURL).setTimestamp();

                if (fortstats.lifeTimeStats) {
                    let n = 0
                    fortstats.lifeTimeStats.forEach(stat => {
                        if(n % 2 == 0 && n > 1)
                            fortembed.addBlankField()
                        fortembed.addField(stat.key, stat.value, true);
                        n++
                    });
                    msg.embed(fortembed);
                } else {
                    msg.say("Sorry but there were no **Life-time Stats** under your name.\nI can't search for specific season's stats.")
                }


            } else {
                msg.say("Error:" + err + "\nStatus Code: " + res.statusCode)
                msg.say("You ran into an error, contact the dev by joining the support server for more info.")
            }
        });

    }

}

module.exports = statsCommand