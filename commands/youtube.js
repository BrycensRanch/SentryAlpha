const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'youtube',
    aliases: [`yt`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `youtube YO FORTNITE SUCKS! DELETE THIS YOUTUBE VIDEO OR I DISLIKE BOMB YOU`,
    description: 'Drop one of the biggest comments.',
    async execute(message, args, client) {
        if (!args[0]) return message.channel.send("Hey, I'm gonna put you on YouTube if you don't provide for me to comment on YouTube! :clown:")
        let avatar = message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let username = message.member.displayName;
        let image = await Canvacord.Canvas.youtube(avatar, username, args.join(" "));
        let attachment = new Discord.MessageAttachment(image, "youtube.png");
        return message.channel.send(attachment);
    },
}