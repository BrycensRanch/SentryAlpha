const Discord = require('discord.js')
const Humanize = require(`humanize-plus`);
module.exports = {
    name: 'balance',
    aliases: [`bal`, `coins`, `tokens`, `bank`, `wallet`],
    cooldown: 1,
    Ready: true,
    usage: `bal Romvnly`,
    description: 'Check the **balance** of a user!',
    async execute(message, args, client, flags, parsedArgs) {
        const {db2: db} = client;
        if (!message.guild) {
            mentionedUser = message.author
        }
        if (message.guild) {
            var mentionedUserRAW = client.utils.resolveMember(parsedArgs.join(" "), message.guild.members.cache, false, false)
            if (mentionedUserRAW) var mentionedUser = mentionedUserRAW.user
        }
        if (!mentionedUser) {
            mentionedUser = message.author
        }
        if (!args[0]) {
            mentionedUser = message.author
        }
        if (mentionedUser.bot && mentionedUser.id !== client.user.id) return message.channel.send("Other bots are beggars. They don't got coin like I do.. Check me.")
        if (mentionedUser.bot && mentionedUser.id == client.user.id) {
            const balEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${mentionedUser.tag}'s Balance`, mentionedUser.avatarURL({dynamic: true}))
                .setDescription(`FUCKING INFINITE GOT ALL THE FUCKING COIN <:emoji_67:620804740111925279>`)
                .setTimestamp()
                .setFooter(`buy coins and dropboxes from shop.sentryalpha.xyz`);
            return message.channel.send(balEmbed)
        }

        let balCheck = db.prepare(`SELECT * FROM Users WHERE user_id = ?`)
        var user;
        try {
            user = balCheck.get(mentionedUser.id)
        }
        catch(err) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription(`There was an error querying the database for ${mentionedUser.toString()}.`)
            )
        }
            if (!user || user && user.balance !== `Infinity`) {
                const balEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${mentionedUser.username}'s Balance`, mentionedUser.avatarURL({dynamic: true}))
                    .setDescription(`**${Humanize.compactInteger(user ? user.balance !== null ? user.balance : client.config.defaultMoney : client.config.defaultMoney, 1)}** Bobux`)
                    .setTimestamp()
                    .setFooter(`buy coins and dropboxes from shop.sentryalpha.xyz`);
                return message.channel.send(balEmbed)
            }
            if (user && user.balance == `Infinity`) {
                const balEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${mentionedUser.username}'s Balance`, mentionedUser.avatarURL({dynamic: true}))
                    .setDescription(`**INFINITE** Bobux`)
                    .setTimestamp()
                    .setFooter(`fr fr you dont even need to buy coins at this point lmao`);
                return message.channel.send(balEmbed)
            }
    },
}