const Discord = require('discord.js')

module.exports = async(client, member) => {
let guildSettingsChannel = client.configChannels.get(member.guild.id)
    if (!guildSettingsChannel) return;
    guildSettingsChannel = guildSettingsChannel.nitroBoost
    if (!guildSettingsChannel) return;
    await client.channels.fetch(guildSettingsChannel).catch(() => null).then(channel => {
        channel.send(
        new Discord.MessageEmbed()
        .setColor(member.displayHexColor || "RANDOM")
        .setAuthor(member.displayName, member.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"}))
        .setTitle(`${member.displayName} has started boosting!`)
        .setDescription(`**${member.user.tag}** (${member.user.id}) has started boosting **${member.guild.name}**!`)
        .setFooter("Sentry Alpha | Logging System")
        .setTimestamp()
        ).catch(() => null)
    })
};