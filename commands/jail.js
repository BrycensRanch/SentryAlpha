const Discord = require('discord.js')
module.exports = {
    name: 'jail',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `jail @Mmadrid509`,
    description: "SEND THIS MAN TO JAIL!",
    async execute(message, args, client) {
        var mentionedUser;
        if(message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if(mentionedUser) mentionedUser = mentionedUser.user
        if(!message.guild) mentionedUser = message.author
        if(!mentionedUser) {
            mentionedUser = message.author
        }
        if(!args[0]) {
            mentionedUser = message.author
        }
        const Canvacord = require("canvacord");
        const canva = new Canvacord();

        let avatar = mentionedUser.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await canva.jail(avatar);
        let attachment = new Discord.MessageAttachment(image, "jail.png");
        return message.channel.send(attachment);
    },
}