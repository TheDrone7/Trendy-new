const discord = require('discord.js')
const { Command } = require('discord.js-commando')
const {dictUrl, dictAccept, dictId, dictKey} = require('../../config')
const request = require('request')

class dictCommand extends Command{

    constructor(client){
        super(client, {
            name: 'dict',
            memberName: 'dict',
            aliases: ['dictionary', 'wordsearch'],
            description: 'Looks up for a word in a dictionary.',
            details: 'Will look up for the word you provide in Oxford dictionary using their API and show the result to you.',
            group: 'general',
            args: [{
                key: 'word',
                type: 'string',
                prompt: 'What would you like to search for?'
            }],
            examples: ['..dict ace','..wordsearch word','..dictionary well']
        })
    }

    run(msg, {word}){
        let options = {
            url: dictUrl,
            headers:{
                "Accept":dictAccept,
                "app_id":dictId,
                "app_key":dictKey
            }
        }
        options.url += word
        request(options,(error, response, body)=>{
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body)
                console.log("'" + info + "'")
                var resultembed = new discord.RichEmbed();
                if(info.results.length < 1){
                    message.channel.send("No results found!")
                    return;
                }
                var examples = "";
                var res = info.results[0];
                res.lexicalEntries.forEach(lexen=>{
                    resultembed = new discord.RichEmbed();
                    resultembed.setTitle(res.id.toUpperCase())
                    resultembed.setFooter("Language: English. Source: Oxford Dictionary");
                    resultembed.addField("Category", lexen.lexicalCategory,true);
                    lexen.entries.forEach(ent=>{
                        ent.senses.forEach(sen=>{
                            if(sen.definitions)
                                resultembed.addField("Meaning",sen.definitions[0])
                            else
                                resultembed.addField("Meaning",'Not provided. Sorry.')
                            examples = "";
                            var exno = 1;
                            if(sen.examples){
                            sen.examples.forEach(ex=>{
                                examples += exno.toString() + ". " + ex.text + "\n\n"
                                exno++
                            })
                            resultembed.addField("Examples of usage",examples);
                            }    
                            resultembed.addBlankField();
                        })
                    })
                    resultembed.fields.pop()
                    resultembed.setColor("RANDOM");
                    resultembed.setThumbnail("https://global.oup.com/system/images/548558/Oxford_Dictionaries_Logo")
                    msg.embed(resultembed)
                })
                setTimeout(()=>{
                    return msg.say("That's all I found :sweat_smile:")
                },5000)
            }
            else{
                msg.reply(" Sorry but no matching records found!")
            }
        })
    }


}

module.exports = dictCommand