const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'invert',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `invert Romvnly`,
    description: "See **someone's true colors.**",
    async execute(message, args, client) {
        if (message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if (mentionedUser) mentionedUser = mentionedUser.user
        if (!message.guild) mentionedUser = message.author
        if (!mentionedUser && !message.attachments.first()) {
            mentionedUser = message.author
        }
        if (!args[0] && !message.attachments.first()) {
            mentionedUser = message.author
        }
        var avatarRAW = message.attachments.map(img => img.url);
        var avatar = avatarRAW.join("")
        if (mentionedUser && args[0]) {
            avatar = mentionedUser.displayAvatarURL({
                dynamic: false,
                format: 'png'
            });
        }
        try {
            let image = await Canvacord.Canvas.invert(avatar)

            let attachment = new Discord.MessageAttachment(image, "invert.png");
            message.channel.send(attachment)
        } catch (err) {
            return message.channel.send(`:x: | ${err}`)
        }
    },
}