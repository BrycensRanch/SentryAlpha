const Discord = require('discord.js')
const UtilsRAW = require(`../Util/ClientUtil`)
const Utils = new UtilsRAW()
const Canvacord = require("canvacord");
module.exports = {
    name: 'kiss',
    aliases: [`simp`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `kiss @PowerGraceful`,
    description: "Kiss someone, get the attention **you never had**.\nYou can even kiss yourself. We support loving yourself.",
    async execute(message, args, client) {
        var mentionedUser;
        if (message.guild) var mentionedUser = Utils.resolveMember(args.join(" "), message.guild.members.cache, {
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
        let image = await Canvacord.Canvas.kiss(avatar, message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        }));
        let attachment = new Discord.MessageAttachment(image, "kiss.png");
        return message.channel.send(attachment);
    },
}