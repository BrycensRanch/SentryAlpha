const Discord = require('discord.js')
const Humanize = require("humanize-plus");

const UtilsRAW = require(`../Util/ClientUtil`)
const Utils = new UtilsRAW()

module.exports = {
    name: 'transactions',
    aliases: [`bankstatements`, `ecologs`, 'ecologs'],
    cooldown: 1,
    description: 'Check your old transactions!',
    Ready: true,
    async execute(message, args, client, flags, parsedArgs) {
        let data = client.db2
        var mentionedUser;
        if (!message.guild) {
            mentionedUser = message.author
        }
        if (message.guild && parsedArgs[0] && client.isBotOwner(message.author)) {
            var mentionedUserRAW = Utils.resolveMember(parsedArgs[0], message.guild.members.cache, false, false)
            if (mentionedUserRAW) var mentionedUser = mentionedUserRAW.user
        }
        if (!mentionedUser) {
            mentionedUser = message.author
        }
        if (!args[0]) {
            mentionedUser = message.author
        }
        if (mentionedUser.bot) return message.channel.send(":x: | Bots do not have transaction logs.")

        const itemsToDisplay = 20;
        var pages = await client.getTransactions(mentionedUser.id)
        if (!pages || !pages[0]) return message.channel.send(`:x: | ${parsedArgs[1] && client.isBotOwner(message.author) ? `The user ${mentionedUser.username} does not have any transaction logs.` : "You do not have any transactions! Maybe run a economy command?"}`)

        var rows = data.prepare(`SELECT rowid, * FROM "eco-logs" WHERE user_id = ? ORDER BY time DESC`).all(mentionedUser.id)
        var pages = rows
        const bottomPageLength = pages.length / itemsToDisplay
        let page = 1
        var entries = []
        var rows = data.prepare(`SELECT rowid, * FROM "eco-logs" WHERE user_id = ? ORDER BY time DESC LIMIT ${itemsToDisplay} OFFSET ${page * itemsToDisplay -itemsToDisplay}`).all(mentionedUser.id)
        if (!rows[0]) return message.channel.send("This row does not exist!")

        function handleRows(rows) {
            client.logger.log(rows)
            for (const row of rows) {
                var i = row.rowid
                var emoji = `\`${i}.\` | ${Math.sign(row.amount)  == -1 ? `<:minus:783453565552820234>` : `<:add:783453529380749313>` }`
                entries.push(`${emoji ? emoji : ""}  **${Humanize.compactInteger(row.amount, 1)}** ${row.reason} - ${new Date(row.time).toLocaleDateString()}`)
            }
        }
        handleRows(rows);
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
            .setDescription(`${entries.join("\n")}`);
        if (message.guild) embed.setAuthor(`${mentionedUser.username}`, mentionedUser.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        if (!message.guild) embed.setAuthor(`${mentionedUser.username}`, mentionedUser.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        message.channel.send(embed).then(msg => {
            msg.react("◀️").then(() => {
                msg.react("▶️")
                //Filters - These  make sure the variables are correct before running a part of code
                const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id
                const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id

                const backwards = msg.createReactionCollector(backwardsFilter, {
                    time: 120000
                });
                const forwards = msg.createReactionCollector(forwardsFilter, {
                    time: 120000
                });
                backwards.on("collect", (r, user) => {
                    if (page === 1) page = Math.ceil(bottomPageLength) + 1;
                    page--;
                    var rows = data.prepare(`SELECT rowid, * FROM "eco-logs" WHERE user_id = ? ORDER BY time DESC LIMIT ${itemsToDisplay} OFFSET ${page * itemsToDisplay -itemsToDisplay}`).all(mentionedUser.id)
                    if (!rows[0]) return message.channel.send("This row does not exist!")
                    entries = []
                    handleRows(rows);
                    embed.setDescription(`${entries.join("\n")}`);
                    embed.setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
                    msg.edit(embed)
                    r.users.remove(user).catch(() => null);
                })
                forwards.on("collect", (r, user) => {
                    if (page === Math.ceil(bottomPageLength)) page = 0;
                    page++;
                    var row = data.prepare(`SELECT rowid, * FROM "eco-logs" WHERE user_id = ? ORDER BY time DESC LIMIT ${itemsToDisplay} OFFSET ${page * itemsToDisplay -itemsToDisplay}`).all(mentionedUser.id)
                    if (!rows[0]) return message.channel.send("This row does not exist!")
                    entries = []
                    handleRows(rows);
                    embed.setDescription(`${entries.join("\n")}`);
                    embed.setFooter(`Page ${page} of ${Math.ceil(bottomPageLength)}`)
                    msg.edit(embed)
                    r.users.remove(user).catch(() => null);
                })
            })
                .catch(err => {
                    console.error(err)
                })
        })
    },
}