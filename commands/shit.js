const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'shit',
    aliases: [`poop`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `poop @Dank Memer`,
    description: "Ew, I stepped in Dank Memer.",
    async execute(message, args, client) {
        if(message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
            caseSensitive: false,
            wholeWord: false
        })
        if(mentionedUser) mentionedUser = mentionedUser.user
        if(!message.guild) mentionedUser = message.author
        if(mentionedUser.id == client.user.id) return message.channel.send("Your mom's gae")
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
        let image = await Canvacord.Canvas.shit(avatar);
        let attachment = new Discord.MessageAttachment(image, "shit.png");
        return message.channel.send(attachment);
    },
}