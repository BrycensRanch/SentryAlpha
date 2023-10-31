const Discord = require('discord.js')

module.exports = {
    name: 'blacklist',
    aliases: [`ignore`, 'unblacklist'],
    cooldown: 1,
    ownerOnly: true,
    Ready: true,
    usage: `blacklist 387062216030945281`,
    description: 'Blacklist a user from using Sentry Alpha!',
    async execute(message, args, client) {
        if (!args.length) return message.reply("you need to feed this command args... how do u not know this U WROTE ME")
        var mentionedUser;
        if (!message.guild) {
            mentionedUser = message.author
        }
        if (message.guild) {
            var guildMember = client.utils.resolveMember(args.join(" "), message.guild.members.cache, {
                caseSensitive: false,
                wholeWord: false
            })
            mentionedUser = guildMember.user
        }
        if (!mentionedUser && args[0]) return message.channel.send(`That user simply... Does not exist.`)
        if (mentionedUser && mentionedUser.bot == true) return message.channel.send(`Bots cannot be blacklisted as they can't even run commands in the first place.`)
        if (!mentionedUser && !args[0]) {
            mentionedUser = message.author
        }
        if (mentionedUser.id == message.author.id) return message.channel.send(`You don't want to blacklist yourself. Been there done that.`)
        let listCheck = client.db2.prepare(`SELECT * FROM blacklistedUsers WHERE userid = ?`)
        const blacklistedUsers = listCheck.get(mentionedUser.id)
            if (blacklistedUsers) {
                let removeUser = client.db2.prepare(`DELETE FROM blacklistedUsers WHERE userid = ?`)
                client.blacklist.delete(mentionedUser.id)
                removeUser.run(mentionedUser.i);
                message.channel.send(`\`${mentionedUser.username}\` has been removed from the blacklist!`);
            }
            if (!blacklistedUsers) {
                let addUser = client.db2.prepare(`INSERT INTO blacklistedUsers VALUES(?)`);
                addUser.run(mentionedUser.id);
                client.blacklist.set(mentionedUser.id, mentionedUser);
                message.channel.send(`\`${mentionedUser.username}\` has been blacklisted.`);
            }
    },
}