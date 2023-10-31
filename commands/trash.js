const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'trash',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `trash @Mmadrid509`,
    description: "Can't see the difference!",
    async execute(message, args, client) {
        var mentionedUser;
        if (message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if (mentionedUser) mentionedUser = mentionedUser.user
        if (!message.guild) mentionedUser = message.author
        if (!mentionedUser) {
            mentionedUser = message.author
        }
        if (!args[0]) {
            mentionedUser = message.author
        }

        let avatar = mentionedUser.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.trash(avatar);
        let attachment = new Discord.MessageAttachment(image, "trash.png");
        return message.channel.send(attachment);
    },
}