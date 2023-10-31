const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'bed',
    aliases: ['monster'],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `monster Foundation Information`,
    description: "Oh no, a monster!",
    async execute(message, args, client) {

        var mentionedUser;
        if(!message.guild) {
            mentionedUser = message.author
        }
        if(message.guild) {
            mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
                caseSensitive: false,
                wholeWord: false
            })
        }
        if(!mentionedUser) {
            mentionedUser = message.author
        }
        if(!args[0]) {
            mentionedUser = message.author
        }
        if(mentionedUser.user) mentionedUser = mentionedUser.user
        let avatar = mentionedUser.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.bed(message.author.displayAvatarURL({
            dynamic: false,
            format: 'png'
        }), avatar);
        let attachment = new Discord.MessageAttachment(image, "bed.png");
        return message.channel.send(attachment);
    },
}