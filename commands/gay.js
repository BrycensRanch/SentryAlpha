const Discord = require('discord.js')
const {Gay: GayAsfClass} = require("discord-image-generation");
const Gay = new GayAsfClass()
module.exports = {
    name: 'gay',
    aliases: [`gae`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `gay @Mmadrid509`,
    description: 'HA, **GAY**!',
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
        let avatar = mentionedUser.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Gay.getImage(avatar);
        let attachment = new Discord.MessageAttachment(image, "gay.png");
        return message.channel.send(attachment);
    },
}