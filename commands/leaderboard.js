const Discord = require('discord.js')
const Humanize = require("humanize-plus");
module.exports = {
    name: 'leaderboard',
    aliases: [`lb`, `rich`],
    cooldown: 2,
    usage: `ping`,
    description: 'Show the leaderboard for economy.',
    Ready: true,
    async execute(message, args, client) {
        const {
            db2: data
        } = client;
        if(!args[0]) {
            const entries = []
            let randomQuery = client.db2.prepare(`SELECT RANK () OVER ( ORDER BY balance DESC) lbRank, * FROM Users WHERE balance > 0 ORDER BY balance DESC LIMIT 10`);
            const rows = randomQuery.all();
            console.log(rows);
                for(const row of rows) {
                    var emoji = `\`${row.lbRank}.\` |`
                    if(row.lbRank == 1) emoji = ":first_place:"
                    if(row.lbRank == 2) emoji = ":second_place:"
                    if(row.lbRank == 3) emoji = ":third_place:"
                    const lbUser = await client.users.fetch(row.user_id).catch(() => null);

                    entries.push(`${emoji} ${lbUser ? lbUser.tag : row.user_id } currently has **${row.balance !== "Infinity" ? Humanize.intComma(row.balance) : row.balance}** Sentry Alpha Coins!`)
                }

                const exampleEmbed = new Discord.MessageEmbed()
                exampleEmbed.setColor('RANDOM')

                if(message.guild) exampleEmbed.setAuthor(`${message.guild.name}`, message.guild.iconURL({
                    dynamic: true,
                    size: 4096
                }))
                if(!message.guild) exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
                    dynamic: true
                }))
                exampleEmbed.setDescription(`${entries.join("\n")}`)
                exampleEmbed.setTimestamp()
                exampleEmbed.setFooter(`🏓 | free vbucks`)
                return message.channel.send(exampleEmbed)
        } else if((args[0] == "server" && message.guild ) || (args[0] == "local" && message.guild) || (args[0] == "guild" && message.guild )) {
            const entries = []
            if(args[1] && isNaN(args[1])) args[1] = 1
            if(args[1] && args[1] < 1) args[1] = 1
            if(args[1] && args[1] == "Infinity" || args[1] == Infinity) args[1] = 1
            if(!args[1]) args[1] = 1;
            let randomQuery = client.db2.prepare(`SELECT RANK () OVER ( ORDER BY balance DESC) lbRank, * FROM Users WHERE balance > 0 ORDER BY balance DESC`);
            const rows = randomQuery.all();
            const offset =Number(args[1]) * 10 -10
                if(!rows[0]) return message.channel.send("This page of the leaderboard does not exist!")
            const members = await message.guild.members.fetch()
            console.log(message.guild)
            console.log(offset);
                const paginatedGUildMembers = rows.filter((u) => members.has(u.user_id))
                for(const row of paginatedGUildMembers.slice(offset, 10)) {
                    var emoji = `\`${row.lbRank}.\` |`
                    if(row.lbRank == 1) emoji = ":first_place:"
                    if(row.lbRank == 2) emoji = ":second_place:"
                    if(row.lbRank == 3) emoji = ":third_place:"
                    const lbUser = await client.users.fetch(row.user_id).catch(() => null);

                    entries.push(`${emoji} ${lbUser ? lbUser.tag : row.user_id } currently has **${row.balance !== "Infinity" ? Humanize.intComma(row.balance) : row.balance}** Sentry Alpha Coins!`)
                }
                if (!paginatedGUildMembers.length) return message.channel.send("This page of the leaderboard does not exist!")
                const exampleEmbed = new Discord.MessageEmbed()
                exampleEmbed.setColor('RANDOM')

                if(message.guild) exampleEmbed.setAuthor(`${message.guild.name}`, message.guild.iconURL({
                    dynamic: true,
                    size: 4096
                }))
                if(!message.guild) exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
                    dynamic: true
                }))
                exampleEmbed.setDescription(entries.join("\n"))
                exampleEmbed.setTimestamp()
                exampleEmbed.setFooter(`Page ${args[1]} of ${Math.ceil(paginatedGUildMembers.length / 10)}`)
                return message.channel.send(exampleEmbed)
        } else {
            if(isNaN(args[0])) args[0] = 1
            if(args[0] < 1) args[0] = 1
            if(args[0] == "Infinity" || args[0] == Infinity) args[0] = 1
            const entries = []
            let randomQuery = `SELECT RANK () OVER ( ORDER BY balance DESC) lbRank, * FROM Users WHERE balance > 0 ORDER BY balance DESC LIMIT 10 OFFSET ?`
            const rows = client.db2.prepare(randomQuery).all(Number(args[0] * 10 -10))
                if(!rows[0]) return message.channel.send("This page of the leaderboard does not exist!")
            console.log(rows);
                for(const row of rows) {
                    var emoji = `\`${row.lbRank}.\` |`
                    if(row.lbRank == 1) emoji = ":first_place:"
                    if(row.lbRank == 2) emoji = ":second_place:"
                    if(row.lbRank == 3) emoji = ":third_place:"
                    const lbUser = await client.users.fetch(row.user_id).catch(() => null);
                    entries.push(`${emoji} ${lbUser ? lbUser.tag : row.user_id } currently has **${row.balance !== "Infinity" ? Humanize.intComma(row.balance) : row.balance}** Sentry Alpha Coins!`)
                }

                const exampleEmbed = new Discord.MessageEmbed()
                exampleEmbed.setColor('RANDOM')

                if (message.guild) exampleEmbed.setAuthor(`${message.guild.name}`, message.guild.iconURL({
                    dynamic: true,
                    size: 4096
                }))
                else exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
                    dynamic: true
                }))
                exampleEmbed.setDescription(entries.join("\n"))
            const pageCount = Math.ceil(client.db2.prepare('SELECT COUNT(*) FROM USERS WHERE balance > 0').pluck().get() / 10);
            exampleEmbed.setFooter(`Page ${args[0]} of ${pageCount}`);

            exampleEmbed.setTimestamp()
                return message.channel.send(exampleEmbed)
        }
    },
}