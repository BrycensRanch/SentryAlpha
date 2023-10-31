const Discord = require('discord.js')
module.exports = {
    name: 'say',
    aliases: [`sayd`],
    cooldown: 5,
    usage: `say`,
    description: "Force the bot to say something! As long as it doesn't have profanity!",
    async execute(message, args, client) {
        if (!args[0]) return message.channel.send(`Next time, give me something to say, idot. `)
        message.channel.send(`${args.join(` `).replace(Discord.MessageMentions.ROLES_PATTERN, '<Redacted Role Mention>')}\n\n\n- **${message.author.tag}**`, {
                disableMentions: "everyone",
                spilt: true
            })
            .catch(err => {
                return message.author.send("Oh boy, did you troll me?")
            })
    },
}