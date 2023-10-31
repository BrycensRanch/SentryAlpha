const Discord = require('discord.js')
const Canvacord = require("canvacord");
module.exports = {
    name: 'spank',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `spank @Mmadrid509`,
    description: "Spank em harder than **Chris Brown**!",
    async execute(message, args, client) {
        if(!message.guild) {
            let mentionedUser;
            if(!mentionedUser) {
                mentionedUser = message.author
            }
            let image = await Canvacord.Canvas.spank(message.author.displayAvatarURL({
                dynamic: false,
                format: 'png'
            }), mentionedUser.displayAvatarURL({
                dynamic: false,
                format: 'png'
            }));
            let attachment = new Discord.MessageAttachment(image, "spank.png");
            return message.channel.send(attachment);
        }
        if(message.guild) {
            var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
                caseSensitive: false,
                wholeWord: false
            })
            if(!mentionedUser) {

                mentionedUser = message.author
            }
            if(mentionedUser.user.bot == true) {
                message.channel.send("No spanking bots, you monster! How about I spank you!")
                var avatar = client.user.displayAvatarURL({
                    dynamic: false,
                    format: 'png'
                });
                let image = await Canvacord.Canvas.spank(avatar, message.author.displayAvatarURL({
                    dynamic: false,
                    format: 'png'
                }));
                let attachment = new Discord.MessageAttachment(image, "EVIL SPANK.png");
                return message.channel.send(attachment);
            }
            var avatar = mentionedUser.user.displayAvatarURL({
                dynamic: false,
                format: 'png'
            });
            let image = await Canvacord.Canvas.spank(message.author.displayAvatarURL({
                dynamic: false,
                format: 'png'
            }), avatar);
            let attachment = new Discord.MessageAttachment(image, "spank.png");
            message.channel.send(attachment);
        }

    },
}