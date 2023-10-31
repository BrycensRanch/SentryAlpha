const Discord = require('discord.js');

module.exports = {
    name: 'f',
    aliases: [`fmoment`, `finthechat`],
    cooldown: 2,
    usage: `f @Romvnly`,
    botPerms: ["ADD_REACTIONS"],
    description: 'F in the chat, guys!',
    Ready: true,
    async execute(message, args, client, flags, parsedArgs) {
        if (!message.guild) return message.channel.send("Who's gonna pay respects to you in a DM?");
        const FeedbackArray = [];
        if (!parsedArgs[0]) parsedArgs[0] = message.member.toString()
        let mentionedUser = client.utils.resolveMember(parsedArgs[0], message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if (!mentionedUser) mentionedUser = message.member
        message.react("🇫")
            .then(r => {
                const upvoteFilter = (reaction, user) => reaction.emoji.name === `${r.emoji.name}` && !FeedbackArray.includes(user.id) && !user.bot

                const upvote = message.createReactionCollector(upvoteFilter, {
                    time: 1000000
                });
                upvote.on("collect", (r, user) => {
                    FeedbackArray.push(user.id)
                    message.channel.send(`**${message.guild.members.cache.get(user.id).displayName}** has sent their regards for **${mentionedUser.displayName}**. React with :regional_indicator_f: on ${message.url} **to pay respects**.`, {
                        disableMentions: "all"
                    })
                })
            })
    },
}