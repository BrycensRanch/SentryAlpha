const Discord = require('discord.js');
const DIG = require("discord-image-generation");
module.exports = {
    name: 'presentation',
    aliases: [],
    cooldown: 2,
    imgCmd: true,
    Ready: true,
    usage: `presentation We should pledge 10k to Sentry Alpha`,
    description: "Get your point across.",
    async execute(message, args, client) {
        if (!args[0]) return message.channel.send(`Next time, add text to what you want to presentate otherwise you'll be looking dumb forever.`)
        let img = await new DIG.LisaPresentation()
            .getImage(args.join(" "));
        let attach = new Discord.MessageAttachment(img, "presentation.png");;
        message.channel.send(attach)
    },
}