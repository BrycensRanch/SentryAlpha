const Discord = require('discord.js')
module.exports = {
    name: 'snipe',
    aliases: [],
    cooldown: 2,
    usage: `snipe\nsnipe -msg=2\nsnipe #bot-commands -msg=2`,
    guildOnly: true,
    description: 'Snipe deleted messages!',
    async execute(message, args, client, flags) {
        if (!message.guild) return message.channel.send(`Sniping your mom in her DMS`)
        if (message.guild) {
            let checkSettings = `SELECT * FROM "Guild Settings" WHERE guildID = "${message.guild.id}"`
            client.db.get(checkSettings, async (err, guildSetting) => {
                if (!guildSetting) return message.channel.send(`Snipe is disabled by the guild owner!`)
                if (guildSetting.snipe) {
                    let msgID = flags.msg
                    if (!msgID) msgID = 1
                    msgID = parseInt(msgID)
                    if (isNaN(msgID)) msgID = 1
                    if (msgID <= 0) msgID = 1
                    if (msgID > 10) return message.channel.send(`For respect out of our user's privacy, although the owner of ${client.user.tag} thinks it impossible to get this many deleted messages in a channel, you may not go past searching 10 deleted messages. If you want deleted message logs, use some other bot, idk.`)
                    const UtilsRAW = require(`../Util/ClientUtil`)
                    const Utils = new UtilsRAW()
                    var mentionedChannel = Utils.resolveChannel(args.join(" "), message.guild.channels.cache.filter(channels => channels.type === 'text'), {
                        caseSensitive: false,
                        wholeWord: false
                    })
                    if (!mentionedChannel) mentionedChannel = message.channel
                    if (!args[0]) mentionedChannel = message.channel
                    var msg = client.snipes.filter(x => x.channel == mentionedChannel.id)
                        .array()[client.snipes.filter(x => x.channel == mentionedChannel.id)
                            .size - msgID]
                    if (!msg || !mentionedChannel.members.map(x => x.id)
                        .includes(message.author.id)) return message.channel.send(`${msgID > 1 ? `No deleted message was found for your search in \`${mentionedChannel.name}\` that was deleted in the order of ${msgID}.` : `No recently deleted messages for \`${mentionedChannel.name}\``}`)
                    if (message.channel.permissionsFor(message.guild.me)
                        .serialize()
                        .VIEW_AUDIT_LOG) {
                        var logs = await message.guild.fetchAuditLogs({
                            type: 72,
                            limit: 1
                        })
                        var entry = logs.entries.filter(delMsg => delMsg.extra.channel.id == msg.channel && delMsg.target.id == msg.author.id)
                            .first()
                    }
                    const SnipedTimeRAW = new Date(msg.timestamp)
                    const SnipedTime = SnipedTimeRAW.toLocaleTimeString()
                    const exampleEmbed = new Discord.MessageEmbed()
                    exampleEmbed.setColor(message.guild.members.cache.has(msg.author.id) ? message.guild.members.cache.get(msg.author.id)
                        .displayHexColor : "RANDOM")
                    exampleEmbed.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.avatarURL({
                        dynamic: true,
                        size: 4096,
                        format: "png"
                    }))
                    if (msg.reference) exampleEmbed.addField(`Replying To`, `[This Message](https://discord.com/channels/${msg.reference.guildID}/${msg.reference.channelID}/${msg.reference.messageID}).`)
                    exampleEmbed.setDescription(`${msg.content}`)
                    if (message.channel.permissionsFor(message.guild.me)
                        .serialize()
                        .VIEW_AUDIT_LOG) {
                        exampleEmbed.setFooter(`🔗 | Message sent at ${SnipedTime}${entry ? ` removed by ${entry.executor.tag}` : ` deleted by ${msg.author.tag}`}.`)
                    } else {
                        exampleEmbed.setFooter(`🔗 | Message sent at ${SnipedTime}.`)
                    }
                    if (msg.image) exampleEmbed.setImage(`${msg.image}`)
                    if (msg.attachments[0]) exampleEmbed.addField("Message Attachments", `**${msg.attachments.join("\n")}**`)
                    message.channel.send(`Last deleted message for \`${mentionedChannel.name}\`.`, exampleEmbed)
                }
                if (!guildSetting.snipe) {
                    return message.channel.send(`Snipe is disabled by the guild owner!`)
                }
            })
        }
    },
}