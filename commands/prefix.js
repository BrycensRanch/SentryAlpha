const Discord = require('discord.js')
module.exports = {
    name: 'prefix',
    aliases: [`setprefix`, `prefixes`],
    cooldown: 5,
    usage: `prefix`,
    guildOnly: true,
    description: "Check prefix of the current guild or change it to whatever you'd like!",
    async execute(message, args, client) {
        const getSettingsQuery = `SELECT * FROM Settings WHERE guildID = ?`
        var row2 = client.db.prepare(getSettingsQuery)
            .get(message.guild.id)
        if (row2.prefix) var prefix = row2.prefix
        if (row2.prefix == client.config.prefix) {
            var prefix = client.config.prefix
            if (message.author.id == message.guild.ownerID && !args[0] || message.author.id == client.config.ownerID && !args[0]) return message.channel.send("The current prefix for this is ``" + prefix + "``. This is the default prefix for " + client.user.username + ". If you'd like to change it, do **" + prefix + "prefix ;**")
            if (message.author.id !== message.guild.ownerID && !args[0] && message.author.id !== client.config.ownerID) return message.channel.send('The current prefix for this is ``' + prefix + '``. This is the default prefix for ' + client.user.username + '.')
        }
        if (!args[0] && prefix !== client.config.prefix && message.author.id !== message.guild.ownerID && message.author.id !== client.config.ownerID) return message.channel.send('The current **prefix for this guild** is ``' + prefix + '``')
        if (!args[0] && prefix !== client.config.prefix && message.author.id == message.guild.ownerID || !args[0] && prefix !== client.config.prefix && message.author.id == client.config.ownerID) return message.channel.send('The current **prefix for this guild** is ``' + prefix + '`` if you would like to change it, do ``' + prefix + 'prefix ;``')
        if (args[0] && message.author.id !== message.guild.ownerID && message.author.id !== client.config.ownerID) return message.channel.send(`Hey, only the guild owner can change the prefix of this guild!`);
        if (args[1]) {
            message.channel.send(`Guild prefixes **cannot** have spaces in them. Please try again without the spaces.`)
        } else {
            let updatePrefix = client.db.prepare(`UPDATE "Settings" SET prefix = ? WHERE guildID = ?`);
            message.channel.send('Changed guild prefix to: ``' + args[0] + '``')
            updatePrefix.run(args[0], message.guild.id)
           var database =  client.db.prepare(getSettingsQuery)
                .get(message.guild.id)
            client.guildSettings.delete(message.guild.id)
            client.guildSettings.set(message.guild.id, database)
        }
    },
}