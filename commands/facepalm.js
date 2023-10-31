const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'facepalm',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `facepalm`,
    description: "Smh, facepalm...",
    async execute(message, args, client) {
        let avatar = message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.facepalm(message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        }));
        let attachment = new Discord.MessageAttachment(image, "facepalm.png");
        return message.channel.send(attachment);
    },
}