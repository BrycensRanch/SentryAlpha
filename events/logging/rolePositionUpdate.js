const Discord = require('discord.js');

module.exports = async(client, role, oldPosition, newPosition) => {
    let guildSettingsChannel = client.configChannels.get(role.guild.id)
    if (!guildSettingsChannel) return;
    guildSettingsChannel = guildSettingsChannel.roleLogs
    if (!guildSettingsChannel) return;
      if (role.guild.id !== "557529166644510731") return;
      if (role.guild.me.permissions.serialize().VIEW_AUDIT_LOG) {
        var logs = await role.guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE", limit: 1})
        var log = logs.entries.first()
        var exeUser = log.executor
        if (exeUser.bot) return;
    }
    await client.channels.fetch("723990629369249852").catch(() => null).then(channel => {
        channel.send(
        new Discord.MessageEmbed()
        .setColor(role.hexColor || "RANDOM")
        .setAuthor(role.guild.me.displayName, role.guild.me.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"}))
        .setTitle(`Role Hierachy Changed`)
        .setDescription(`${role.toString()} was moved in the role hierachy.`)
        .addField("Old Hierachy:", `${role.guild.roles.cache.find(role2 => role2.position == oldPosition).toString()}\nunder\n${role.guild.roles.cache.find(role2 => role2.position == oldPosition -1).toString()}\n`)
        .addField("New Hierachy", `${role.guild.roles.cache.find(role2 => role2.position == newPosition).toString()}\nunder\n${role.guild.roles.cache.find(role2 => role2.position == newPosition -1).toString()}`)
        .addField("Done By:" , `${role.guild.me.permissions.serialize().VIEW_AUDIT_LOG ? `${`${exeUser.tag} (${exeUser.id})`}` : "Unknown, please give me the \`View Audit Log\` permission!"}`)
        .setFooter("Sentry Alpha | Logging System")
        .setTimestamp()
        );
    })
};