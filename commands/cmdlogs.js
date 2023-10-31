const Discord = require('discord.js')
module.exports = {
    name: 'cmdlogs',
    aliases: ["cl", "cmdlog", "logs"],
    cooldown: 2,
    usage: `cmdlogs\ncmdlogs 1`,
    description: 'Shows the recent commands ran, in order by newest.',
    Ready: true,
    ownerOnly: true,
    async execute(message, args, client) {
        client.db2.serialize(function () {
            let randomQuery = `SELECT rowid, * FROM stats ORDER BY date DESC`
            client.db2.all(randomQuery, (err, rows) => {
                if (err) return message.channel.send("There was an error querying the database for analytics. Please try again later.")
                let pages = rows
                const bottomPageLength = pages.length / 10
                let page = 1
                var entries = []
                let randomQuery = `SELECT rowid, * FROM stats ORDER BY date DESC LIMIT 10 OFFSET ${page * 10 -10}`
                client.db2.all(randomQuery, (err, rows) => {
                    if (err) return message.channel.send("There was an error querying the database for analytics. Please try again later.")
                    if (!rows[0]) return message.channel.send("This row does not exist!")
                    for (const row of rows) {
                        var i = row.rowid
                        var emoji = `💬 (${i})`
                        if (i == Math.ceil(bottomPageLength)) emoji = `🆕 (${i})`
                        if (i == Math.ceil(bottomPageLength) - 1) emoji = `🆕 (${i})`
                        if (i == Math.ceil(bottomPageLength) - 2) emoji = `🆕 (${i})`
                        entries.push(`${emoji ? emoji : ""} The ${row.command} command was ran at ${new Date(row.date).toLocaleString()}`)
                    }
                    const embed = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
                        .setDescription(`${entries.join("\n")}`);
                    message.channel.send(embed)
                        .then(msg => {
                            msg.react("◀️")
                                .then(r => {
                                    msg.react("▶️")
                                    msg.react("❌")
                                    //Filters - These  make sure the variables are correct before running a part of code
                                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id
                                    const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id
                                    const DeleteFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id

                                    const backwards = msg.createReactionCollector(backwardsFilter, {
                                        time: 120000
                                    });
                                    const forwards = msg.createReactionCollector(forwardsFilter, {
                                        time: 120000
                                    });
                                    const deleteMe = msg.createReactionCollector(DeleteFilter, {
                                        time: 120000
                                    });
                                    backwards.on("collect", (r, user) => {
                                        if (page === 1) page = Math.ceil(bottomPageLength) + 1;
                                        page--;
                                        var entries = []
                                        let randomQuery = `SELECT rowid, * FROM stats ORDER BY date DESC LIMIT 10 OFFSET ${page * 10 -10}`
                                        client.db2.all(randomQuery, (err, rows) => {
                                            if (err) return message.channel.send("There was an error querying the database for analytics. Please try again later.")
                                            if (!rows[0]) return message.channel.send("This row does not exist!")
                                            for (const row of rows) {
                                                var i = row.rowid
                                                var emoji = `💬 (${i})`
                                                if (i == Math.ceil(bottomPageLength)) emoji = `🆕 (${i})`
                                                if (i == Math.ceil(bottomPageLength) - 1) emoji = `🆕 (${i})`
                                                if (i == Math.ceil(bottomPageLength) - 2) emoji = `🆕 (${i})`
                                                entries.push(`${emoji ? emoji : ""} The ${row.command} command was ran at ${new Date(row.date).toLocaleString()}`)
                                            }
                                            embed.setDescription(`${entries.join("\n")}`);
                                            embed.setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
                                            msg.edit(embed)
                                            r.users.remove(user)
                                                .catch(() => null);
                                        })
                                    })
                                    deleteMe.on("collect", r => {
                                        msg.delete()
                                            .catch(err => {
                                                return;
                                            })
                                    })
                                    forwards.on("collect", (r, user) => {
                                        if (page === Math.ceil(bottomPageLength)) page = 0;
                                        page++;
                                        var entries = []
                                        let randomQuery = `SELECT rowid, * FROM stats ORDER BY date DESC LIMIT 10 OFFSET ${page * 10 -10}`
                                        client.db2.all(randomQuery, (err, rows) => {
                                            if (err) return message.channel.send("There was an error querying the database for analytics. Please try again later.")
                                            if (!rows[0]) return message.channel.send("This row does not exist!")
                                            for (const row of rows) {
                                                var i = row.rowid
                                                var emoji = `💬 (${i})`
                                                if (i == Math.ceil(bottomPageLength)) emoji = `🆕 (${i})`
                                                if (i == Math.ceil(bottomPageLength) - 1) emoji = `🆕 (${i})`
                                                if (i == Math.ceil(bottomPageLength) - 2) emoji = `🆕 (${i})`
                                                entries.push(`${emoji ? emoji : ""} The ${row.command} command was ran at ${new Date(row.date).toLocaleString()}`)
                                            }
                                            embed.setDescription(`${entries.join("\n")}`);
                                            embed.setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
                                            msg.edit(embed)
                                            r.users.remove(user)
                                                .catch(() => null);
                                        })
                                    })
                                })
                                .catch(err => {
                                    console.error(err)
                                })
                        })
                })
            })
        })
    },
}