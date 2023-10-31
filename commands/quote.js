const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'quote',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    guildOnly: true,
    usage: `quote Sentry I've always hated humans\nquote If I had a dollar for how many 11 year olds play Fortnite, I'd have over **100k dollars** and be rich and not being a bot anymore.`,
    description: "Force people to drop quotes. Not that much of a good image command, but meh.",
    async execute(message, args, client) {
        if (message.guild) var mentionedUser = client.utils.resolveMember(args[0] || message.member.id, message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if (mentionedUser) mentionedUser = mentionedUser
        if (!message.guild) mentionedUser = message.member
        if (!mentionedUser) {
            mentionedUser = message.member
        }
        if (mentionedUser) delete args[0]

        let avatar = message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.quote({
            username: mentionedUser.displayName,
            message: args.join(" "),
            image: mentionedUser.user.displayAvatarURL({
                dynamic: false,
                format: 'png',
                color: `${mentionedUser.displayHexColor || "RANDOM"}`
            })
        })
        let attachment = new Discord.MessageAttachment(image, "quote.png");
        return message.channel.send(attachment);
    },
}