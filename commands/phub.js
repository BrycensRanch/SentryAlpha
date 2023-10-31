const Discord = require('discord.js')
const Canvacord = require("canvacord");

module.exports = {
    name: 'phub',
    aliases: ['hub'],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `phub I think fortnite is trash`,
    description: "Drop facts on a platform you can relate to.",
    async execute(message, args, client) {
        if (!args[0]) return message.reply("Hey, you need to give me some text!")
        let avatar = message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.phub({
            username: message.member.nickname || message.author.username,
            message: args.join(" "),
            image: avatar
        });
        let attachment = new Discord.MessageAttachment(image, "facepalm.png");
        return message.channel.send(attachment);

    },
}