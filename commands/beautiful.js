const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'beautiful',
    aliases: ['hot', 'pretty'],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `hot Sentry Alpha`,
    description: "Hey, that's hot!",
    async execute(message, args, client) {
        if(!message.guild) {
            let mentionedUser = message.author
        }
        if(message.guild) {
            var mentionedUserRAW = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
                caseSensitive: false,
                wholeWord: false
            })
            if(mentionedUserRAW && mentionedUserRAW.user) {
                var mentionedUser = mentionedUserRAW.user
            }
        }
        if(!args[0]) {
            mentionedUser = message.author
        }
        if(!mentionedUser) {
            mentionedUser = message.author
        }

        let avatar = mentionedUser.displayAvatarURL({
            dynamic: false,
            format: 'png'
        });
        let image = await Canvacord.Canvas.beautiful(avatar);
        let attachment = new Discord.MessageAttachment(image, "beautiful.png");
        return message.channel.send(attachment);
    },
}