const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'deepfry',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `deepfry Romvnly`,
    description: "Deepfry users or images because **why not**?",
    async execute(message, args, client) {
        var mentionedUser;
        if(message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if(mentionedUser) mentionedUser = mentionedUser.user
        if(!message.guild) mentionedUser = message.author
        if(!mentionedUser && !message.attachments.first()) {
            mentionedUser = message.author
        }
        if(!args[0] && !message.attachments.first()) {
            mentionedUser = message.author
        }
        if(message.mentions.members.first()) {
            mentionedUser = message.mentions.members.first().user
        }

        var avatarRAW = message.attachments.map(img => img.url);
        var avatar = avatarRAW.join("")
        if(!avatar.length) {
            avatar = mentionedUser.displayAvatarURL({
                dynamic: false,
                format: 'png'
            });
        }

        let image = await Canvacord.Canvas.deepfry(avatar).catch(err => {
            return message.channel.send(`:x: | ${err}`)
        })
        let attachment = new Discord.MessageAttachment(image, "deepfry.png");
        return message.channel.send(attachment);
    },
}