const Discord = require('discord.js')
module.exports = {
    name: 'editsnipe',
    aliases: ['esnipe'],
    cooldown: 2,
    usage: `editsnipe\editsnipe -msg=2\editsnipe #bot-commands -msg=2`,
    guildOnly: true,
    description: 'Snipe edited messages!',
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
                    if (msgID > 10) return message.channel.send(`For respect out of our user's privacy, although the owner of ${client.user.tag} thinks it impossible to get this many edited messages in a channel, you may not go past searching 10 edited messages. If you want edited message logs, use some other bot, idk.`)
                    var mentionedChannel = client.utils.resolveChannel(args.join(" "), message.guild.channels.cache.filter(channels => channels.type === 'text'), {
                        caseSensitive: false,
                        wholeWord: false
                    });
                    if (!mentionedChannel) mentionedChannel = message.channel;
                    if (!args[0]) mentionedChannel = message.channel;
                    var msg = client.editsnipes.filter(x => x.channel == mentionedChannel.id)
                        .array()[client.editsnipes.filter(x => x.channel == mentionedChannel.id)
                            .size - msgID]
                    if (!msg || !mentionedChannel.members.map(x => x.id)
                        .includes(message.author.id)) return message.channel.send(`${msgID > 1 ? `No edited message was found for your search in \`${mentionedChannel.name}\` that was edited in the order of ${msgID}.` : `No recently edited messages for \`${mentionedChannel.name}\``}`)
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
                    exampleEmbed.setDescription(msg.content);
                    exampleEmbed.setFooter(`🔗 | Message edited at ${SnipedTime}.`);
                    if (msg.image) exampleEmbed.setImage(msg.image);
                    if (msg.attachments[0]) exampleEmbed.addField("Message Attachments", `**${msg.attachments.join("\n")}**`);
                    message.channel.send(`Last edited message for \`${mentionedChannel.name}\`.`, exampleEmbed)
                }
                if (!guildSetting.snipe) {
                    return message.channel.send(`Snipe/Editsnipe is disabled by the guild owner!`)
                }
            })
        }
    },
}