const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'delete',
    aliases: [`thanos`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `delete @Mmadrid509`,
    description: 'DELETE THIS',
    async execute(message, args, client) {
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
        let image = await Canvacord.Canvas.delete(avatar);
        let attachment = new Discord.MessageAttachment(image, "deleted.png");
        return message.channel.send(attachment);
    },
}