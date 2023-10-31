const Discord = require('discord.js');

module.exports = async(client, member, role) => {
    let guildSettingsChannel = client.configChannels.get(member.guild.id)
    if (!guildSettingsChannel) return;
    guildSettingsChannel = guildSettingsChannel.roleLogs
    if (!guildSettingsChannel) return;
    if (member.guild.me.permissions.serialize().VIEW_AUDIT_LOG) {
        var logs = await member.guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE", limit: 1})
        var log = logs.entries.first()
        var exeUser = log.executor
        if (exeUser.bot) return;
    }
    await client.channels.fetch(guildSettingsChannel).catch(() => null).then(channel => {
        channel.send(
        new Discord.MessageEmbed()
        .setColor(role.hexColor || "RANDOM")
        .setAuthor(member.displayName, member.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"}))
        .setTitle(`Role Added`)
        .setDescription(`**${member.user.tag}** (${member.id}) has been given the role:\n  **${role.name}**!\nOld Roles: ${member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).filter(roles => roles.position !== 0 && roles.position !== role.position).map(role => `${role}`).join(" ?")}\n\nNew Role: ${role.toString()}`)
        .addField("Added By:" , `${member.guild.me.permissions.serialize().VIEW_AUDIT_LOG ? `${exeUser.id !== member.id ? `${exeUser.tag} (${exeUser.id})` : "Themselves."}` : "Unknown, please give me the \`View Audit Log\` permission!"}`)
        .setFooter("Sentry Alpha | Logging System")
        .setTimestamp()
        ).catch(() => null)
        })
};