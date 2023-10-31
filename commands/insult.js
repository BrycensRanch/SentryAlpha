const Discord = require('discord.js')
const axios = require('axios');
var entities = {
    'amp': '&',
    'apos': '\'',
    '#x27': '\'',
    '#x2F': '/',
    '#39': '\'',
    '#47': '/',
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'quot': '"'
}

function decodeHTMLEntities(text) {
    return text.replace(/&([^;]+);/gm, function (match, entity) {
        return entities[entity] || match
    })
}
module.exports = {
    name: 'insult',
    aliases: [
    `rude`, `noob`, `roast`
  ],
    cooldown: 2,
    usage: `insult @Mmadrid509`,
    description: 'Drop the biggest bombs of insults ever seen!',
    async execute(message, args, client) {
        var mentionedUserRAW = client.utils.resolveMember(args.join(" "), message.guild.members.cache, false, false)
        if (mentionedUserRAW) var mentionedUser = mentionedUserRAW.user
        if (!args[0]) {
            mentionedUser = message.author
        }
        axios.get(`https://evilinsult.com/generate_insult.php?lang=en&type=json`)
            .then(
                function (response) {
                    return message.channel.send(
                        `**${mentionedUser ? mentionedUser.username : args.join(' ').trim()}**, this one's for you.\n${decodeHTMLEntities(response.data.insult)}`, {
                            disableMentions: 'all'
                        }
                    )
                }
            )
            .catch(err => {
                console.log(err)
                return message.channel.send(
                    `Oh no, I'm all out of insults! Come again later!`
                )
            })
    }
}