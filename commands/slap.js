const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'slap',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `slap @Mmadrid509`,
    description: "Slap em harder than **Chris Brown**!",
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
        let image = await Canvacord.Canvas.slap(message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        }), avatar);
        let attachment = new Discord.MessageAttachment(image, "slap.png");
        return message.channel.send(attachment);
    },
}