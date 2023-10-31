const Discord = require('discord.js')
module.exports = {
    name: 'jokeoverhead',
    aliases: [`missedthejoke`, `missedjoke`],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `joke @Mmadrid509`,
    description: "Bro really missed the joke, **hard**.",
    async execute(message, args, client) {
        var mentionedUser;
        if (message.guild) var mentionedUser = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
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
        let image = await Canvacord.Canvas.jokeoverhead(avatar);
        let attachment = new Discord.MessageAttachment(image, "joke.png");
        return message.channel.send(attachment);
    },
}