const Discord = require('discord.js')
const axios = require("axios");

module.exports = {
	name: 'vote',
	aliases: [],
	cooldown: 2,
    usage: `vote`,
    category: "Misc",
    description: `Vote for Sentry Alpha!`,
	async execute(message, args, client) {
       await message.channel.send(
            new Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor || "RANDOM")
            .setDescription("To vote for Sentry Alpha, [click here](https://sentry.best/vote).\nThis will allow you to vote on every site that Sentry Alpha is listed on and the vote feed.")
        )
    }
}