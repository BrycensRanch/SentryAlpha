const Discord = require('discord.js')
module.exports = {
    name: 'invite',
    aliases: ["support", "inv", "inviteme", "addme"],
    cooldown: 2,
    usage: `invite`,
    description: 'Get a invite for Sentry Alpha, add it to your server!',
    async execute(message, args, client) {
        const inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`**To add ${client.user.username} to your server, [click here](https://sentry.best/invite)\nSupport Server**: [click here](https://sentry.best/support)`);
        inviteEmbed.setColor('#36393E')
        message.channel.send(inviteEmbed);
    },
}