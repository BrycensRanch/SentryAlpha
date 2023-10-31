const Discord = require('discord.js')
const humanized = {
    memberJoin: "Join Logs",
    nitroBoost: "Nitro Boost Logs",
    modLogs: "Mod Logs",
    inviteLogs: "Invite Logs",
    messageLogs: "Message Logs",
    welcomeLogs: "Welcome Logs",
    roleLogs: "Role Logs",
    channelLogs: "Channel Logs",
    nicknameLogs: "Nickname Logs",
    spellcheck: "Spell checking",
    remove_roles: "Remove Roles On Mute",
    welcomeChannel: "Welcome Channel",
    goodbyeChannel: "Goodbye Channel",
    prefix: "Guild Prefix",
    snipe: "Sniping",
    admin: "Admins Can Moderate Mods"
}

function humanize(text) {
    if (humanized[text]) return humanized[text];
    else return text;
}

function serialize(obj) {
    if (typeof obj !== "object") throw new TypeError(`Not the correct type. Got a ${typeof obj} instead of a objexct.`);
    for (const [key, value] of Object.entries(obj)) {
        if (obj[key] == "false") obj[key] = false;
        if (obj[key] == "true") obj[key] = true;
        if (obj[key] === 1) obj[key] = true;
        if (obj[key] === 0) obj[key] = false;
    }
    return obj;
}

function sub(channel, text1, text2) {
    if (channel.permissionsFor(channel.guild.me)
        .serialize()
        .USE_EXTERNAL_EMOJIS) return text1;
    else return text2;
}

// I must admit, this command is a NIGHTMARE!
module.exports = {
    name: 'config',
    aliases: [`setup`, `set`, `settings`],
    cooldown: 10,
    userPerms: ["MANAGE_GUILD"],
    guildOnly: true,
    usage: `setup spellcheck off`,
    description: "Setup a guild's configuration or change current settings of guild.",
    async execute(message, parsedArgs, client) {
        if (!parsedArgs[0] && !parsedArgs[1]) {
            const settingsEmbed = new Discord.MessageEmbed()
                .setColor(message.member.displayHexColor)
                .setAuthor(`${message.guild.name} Server Settings`, `${message.guild.iconURL({dynamic: true, size: 4096, format: "png"}) || "https://icon-library.com/images/custom-discord-icon/custom-discord-icon-24.jpg"}`)
                .setDescription(`Would you like to **change** or **view** your settings? You have 30 seconds to respond! `)
                .setTimestamp()
                .setFooter(`Maybe while you're changing or viewing your settings you can view https://shoppy.gg/@Romvnly`);
            const initMsg = await message.channel.send(settingsEmbed)
                .catch(err => {
                    message.author.send(`I don't have permissions to send a message to your channel!`)
                        .catch(err => {
                            return;
                        })
                })
            const filter = m => m.author.id === message.author.id
            message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })

                .then(collected => {
                    if (collected.first()
                        .content == `view`) {
                        const changeSettingsEmbed = new Discord.MessageEmbed()
                            .setColor(message.member.displayHexColor)
                            .setAuthor(`${message.guild.name} Settings`, `${message.guild.iconURL({dynamic: true, size: 4096, format: "png"}) || "https://icon-library.com/images/custom-discord-icon/custom-discord-icon-24.jpg"}`)
                            .setDescription(`Want to change a setting? Just say the setting's name!`)
                            .setTimestamp()
                        // .setFooter(`Maybe while you're changing or viewing your settings you can view https://shoppy.gg/@Romvnly`);
                        let Settings = client.guildConfigs.get(message.guild.id)
                        let prefix;
                        const config = client.guildSettings.get(message.guild.id)
                        if (config) prefix = config.prefix
                        console.log(Settings)
                        const guildConfigChannels = client.configChannels.get(message.guild.id)
                        changeSettingsEmbed.addFields({
                            name: "Guild Prefix",
                            value: `${prefix || client.config.prefix}`
                        }, {
                            name: `**Remove roles on mute?** 💻`,
                            value: `${Settings.remove_roles ? `${sub(message.channel, "<:onblurple:774811917713801249>", "✅")} | Yes` : `${sub(message.channel, "<:offgray:774811917273137184>", "❌")} | No`}`
                        }, {
                            name: `**Sniping allowed?** 💻`,
                            value: `${Settings.snipe ? `${sub(message.channel, "<:onblurple:774811917713801249>", "✅")} | Yes` : `${sub(message.channel, "<:offgray:774811917273137184>", "❌")} | No`}`
                        }, {
                            name: `**Spell checking allowed?** 💻`,
                            value: `${Settings.spellcheck ? `${sub(message.channel, "<:onblurple:774811917713801249>", "✅")} | Yes` : `${sub(message.channel, "<:offgray:774811917273137184>", "❌")} | No`}`
                        }, {
                            name: `**Admins can Moderate Mods?**`,
                            value: `${Settings.admin ? `${sub(message.channel, "<:onblurple:774811917713801249>", "✅")} | Yes` : `${sub(message.channel, "<:offgray:774811917273137184>", "❌")} | No`}`,
                            inline: true
                        }, {
                            name: '\u200B',
                            value: '\u200B'
                        })
                        changeSettingsEmbed.addFields({
                                name: 'Admin Ranks',
                                value: `${Settings.adminrank1 || `Not set yet.`}`,
                                inline: true
                            }, {
                                name: 'Mod Ranks',
                                value: `${Settings.adminrank2 || `Not set yet.`}`,
                                inline: true
                            }, {
                                name: 'Muted Role',
                                value: `${Settings.muted || `Not set yet.`}`,
                                inline: true
                            }

                        )
                        for (const [key, data] of Object.entries(guildConfigChannels)) {
                            if (key !== "guildID") {
                                changeSettingsEmbed.addFields({
                                    name: `${humanized[key] || key}`,
                                    value: `${guildConfigChannels[key] ? `<#${guildConfigChannels[key]}>` :  `Not set yet.`}`,
                                    inline: true
                                }, )
                            }
                        }
                        return initMsg.edit(`Here are ${message.guild.name}'s current settings:`, changeSettingsEmbed)
                            .catch(() => null)
                    }
                    if (collected.first()
                        .content == `change`) {
                        const viewSettingsEmbed = new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor(`${message.guild.name} Settings`, message.author.avatarURL())
                            .setDescription(`Chaning settings using a prompt will be coming soon! Please be patient. `)
                            .setTimestamp()
                            .setFooter(`Gangsta Settings`);
                        return initMsg.edit(`Yes, I see`, viewSettingsEmbed)
                            .catch(err => {
                                return;
                            })
                    }
                    if (collected.first()
                        .content.toLowerCase()
                        .startsWith(`cancel`) || collected.first()
                        .content.toLowerCase()
                        .endsWith(`cancel`)) {
                        message.channel.send(`Prompt cancelled!!! `)
                        setTimeout(function () {
                            return initMsg.delete(err => {
                                return;
                            })
                        }, 10000);
                    }
                })
                .catch(err => {
                    console.error(err)
                    message.channel.send(`Can't even make up yo mind. Shame on you. SHAME!`)
                        .catch(() => null)
                    initMsg.delete({
                            timeout: 2500
                        })
                        .catch(() => null)
                })

        }
        const blacklistedConfigs = ["guildID", "guildName", "premium"]
        const keys = Object.keys(client.guildConfigs.get(message.guild.id))
            .concat(Object.keys(client.guildSettings.get(message.guild.id))
                .concat(Object.keys(client.configChannels.get(message.guild.id))))
            .filter(x => !blacklistedConfigs.includes(x))
            .map(x => humanized[x] || x)
        if (parsedArgs[0] && !parsedArgs[1] && keys.includes(parsedArgs[0].toLowerCase())) {
            const giveOptionEmbed = new Discord.MessageEmbed()
                .setColor(message.member.displayHexColor)
                .setDescription(`What would you like to do with this config option? Turn it off? Turn it on? Activate it? Specify!`)
                .setTimestamp()
                .setFooter(`https://shoppy.gg/@Romvnly for epic purchases and dealz`);
            const initOptionMSG = await message.channel.send('Woah there bud! Wait a second!', giveOptionEmbed)
            const filter = m => m.author.id === message.author.id
            message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })

                .then(async collected => {
                    if (!options.includes(collected.first()
                            .content.toLowerCase())) return message.channel.send(`That's not a option! Call me back when you wise up. Like come on man, it's like on and off... How hard is this for you? 🤡🤡🤡🤡🤡`)
                    initOptionMSG.delete()
                        .catch(err => {
                            return;
                        })
                    collected.first()
                        .delete()
                        .catch(err => {
                            return;
                        })

                    parsedArgs[1] = collected.first()
                        .content.toLowerCase()
                    return console.log(parsedArgs)
                })
                .catch(errs => {
                    initOptionMSG.delete()
                        .catch(err => {
                            return;
                        })
                })
        } else if (parsedArgs[0]) {
            var configOption;
            const config = client.guildConfigs.get(message.guild.id);
            const guildChannels = client.configChannels.get(message.guild.id);
            if (client.guildSettings.has(message.guild.id)) var prefix = client.guildSettings.get(message.guild.id)
                .prefix;
            configOption = parsedArgs[0]
            let OptionType = false;
            if (parsedArgs[1]) OptionType = client.humanizeOption(parsedArgs[1])

            if (!Object.keys(config)
                .includes(configOption.toLowerCase())) return message.channel.send(`That is not an configuration option! Here is all the available options:\n\`\`\`js\n${keys.map(x => `${prefix || client.config.prefix}${this.name} "${humanized[x] || x}" <on|off>`).join("\n")}\`\`\``)
            client.db.prepare(`UPDATE OR IGNORE "${parsedArgs[0] ? "Guild Settings" : "Guild Channels"}" SET ${configOption} = ? WHERE guildID = ?`)
                .run(OptionType.toString(), message.guild.id)
            if (client.guildConfigs.has(message.guild.id)) client.guildConfigs.get(message.guild.id)[configOption] = OptionType;
            await message.channel.send(`Successfully set ${humanized[configOption] || configOption} to ${parsedArgs[1]} in the database!`)
            console.log(configOption, OptionType)
        }

        // }

    },
}