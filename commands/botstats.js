const Discord = require('discord.js')
const time = new Date()
    .getTime();

module.exports = {
    name: 'botstats',
    aliases: [`usage`, `servers`, `patreons`, `stats`],
    cooldown: 10,
    description: 'Check the bot statistics!',
    async execute(message, args, client) {
        const {
            db2: db2
        } = client;
        const votes = await client.getRecentVotes();
        var vultrex = votes.filter(votes => votes.site == "vultrex")
            .length
        var dblabs = votes.filter(votes => votes.site == "dlabs")
            .length
        var topgg = votes.filter(votes => votes.site == "top.gg")
            .length
        var bfd = votes.filter(votes => votes.site == "bfd")
            .length
        var space = votes.filter(votes => votes.site == "space")
            .length
        var boats = votes.filter(votes => votes.site == "boat")
            .length
        var dbl = votes.filter(votes => votes.site == "dbl")
            .length
        const botstats = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`${client.user.username}'s Epic Statz`, client.user.avatarURL())
            .setDescription(`Bot statistics for ${client.user.tag}. Statistics from bot list, command usage database, etc.\nWant to vote for Sentry Alpha? Now is better than never! https://sentry.best/vote\n**NOTE**: These are votes for THIS MONTH, this is not based on voting intervals.`)
            .addField(`View In-Depth Stats`, `[statcord.com](https://statcord.com/bot/${client.user.id})`)
            .addField(`top.gg`, `Votes: ${topgg || 0}`)
            .addField(`discordbots.co`, `Votes: ${vultrex || 0}`)
            .addField('bots.discordlabs.org', `Votes: ${dblabs || 0}`)
            .addField(`botsfordiscord.com`, `Votes: ${bfd || 0}`)
            .addField(`botlist.space`, `Votes: ${space || 0}`)
            .addField(`discord.boats`, `Votes: ${boats || 0}`)
            .addField(`discordbotlist.com`, `Votes: ${dbl || 0}`)
            .setTimestamp()
            .setFooter(`Epic gamer moments brought to you by sentry.best/vote`);
        let commandQuery = `SELECT * FROM stats`
        const command = db2.prepare(commandQuery).all()
            botstats.addField(`Command Statz`, `Total Commands Used: ${command.length || 0}`)
            let donatorQuery = `SELECT * FROM Donators WHERE expires > ?`
            const donators = db2.prepare(donatorQuery).all(time)
                botstats.addField(`Total ${client.user.tag} Premium Users`, `${donators.length} users now know no pain or suffering.`)
                botstats.addField(`Users:`, `${client.users.cache.size} Users, epic!`)
                botstats.addField(`Servers:`, `${client.guilds.cache.size} Servers are have been brought to heaven!`)
                await message.channel.send(botstats)
    },
}