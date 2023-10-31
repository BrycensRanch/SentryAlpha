const Discord = require('discord.js');
const humanizeDuration = require(`humanize-duration`);
const endOfLine = require('os')
    .EOL;
module.exports = {
    name: 'help',
    aliases: [`cmds`, `commands`, `helps`, `command`, `cmd`],
    cooldown: 1, // One second for basic coolowns
    usage: `help\nhelp ping`,
    botPerms: ["EMBED_LINKS"],
    description: 'Get information on commands!!',
    async execute(message, args, client) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setColor('ORANGE')
                .setAuthor(`${client.user.username}`, client.user.avatarURL())
                .setTimestamp()
                .setFooter("Epic gamer moments brought to you by sentry.best");
            const embed2 = new Discord.MessageEmbed()
                .setColor('ORANGE')
                .setAuthor(`${client.user.username}`, client.user.avatarURL())
                .setTimestamp()
                .setFooter("Epic gamer moments brought to you by sentry.best");
            helpCmd(embed, message, client, embed2)
            if (message.guild) {
                var RAWprefix = client.guildSettings.get(message.guild.id)
                if (RAWprefix) var prefix = RAWprefix.prefix
                if (!prefix) var prefix = client.config.prefix
                embed.setDescription(`:books: Command Usage Example :book:\n\`\`\`ini\n[ Do ${prefix}help ${client.commands.filter(cmd => !cmd.ownerOnly).random().name} ]\`\`\`\n\nHi, **I am a bot made for enhancing both guild members's experience**. I have various awesome functions like image generation, epic jokes, epic memes from Reddit, the king of memes. I also have TikTok memes in-case all your members are 13 year olds. You'll either learn to love me, or deal with me being used to insult you!`)
                await message.channel.send(embed)
            }
            if (!message.guild) return message.channel.send(embed)

        }
        if (args[0]) {
            var command = client.commands.get(`${args[0]}`)
            if (command == undefined) {
                command = client.aliases.get(args[0])
            }
            if (command == undefined) {
                const noCMD = new Discord.MessageEmbed()
                    .setColor('BLACK')
                    .setTitle(`${client.user.username} Help Menu`, client.user.avatarURL())
                    .setDescription(`Help topic for *${args.join(" ").substr(0, 30)}${args.join(" ").charAt(30) ? '...' : ''}* not found.`)
                    .setFooter("Maybe you'd find a command if you bought from shop.sentry.best");
                return message.channel.send(`Command/help category not found!`, noCMD)
            } else {
                if (message.author.id !== client.config.ownerID) {
                    if (command.ownerOnly == true) {
                        const noCMD = new Discord.MessageEmbed()
                            .setColor('BLACK')
                            .setTitle(`${client.user.username} Help Menu`, client.user.avatarURL())
                            .setDescription(`Help topic for *${args.join(" ").substr(0, 30)}${args.join(" ").charAt(30) ? '...' : ''}* not found.`)
                            .setFooter("Maybe you'd find a command if you bought from shop.sentry.best");
                        return message.channel.send(`Command/help category not found!`, noCMD)
                    }
                }
                if (command.usage == undefined) command.usage = `${command.name}`
                if (command.cooldown == undefined) command.cooldown = 2
                var prefix = client.config.prefix


                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle(`${command.name.charAt(0).toUpperCase() + command.name.slice(1)} Command`)
                    .setAuthor(`${client.user.username}`, client.user.avatarURL())
                    .setDescription(":books: Command information :book:")
                    .setTimestamp()
                if (command.aliases[0]) {
                    exampleEmbed.addField('Alliases:', '``' + command.aliases.join(', ') + '``', {
                        inline: true
                    })
                }
                if (command.category || command.imgCmd) exampleEmbed.addFields({
                    name: `Category: `,
                    value: `${command.category || command.imgCmd ? `Image Commands` : false ||"None"}`,
                    inline: true
                })
                exampleEmbed.addFields({
                    name: `Cooldown: `,
                    value: `${humanizeDuration(command.cooldown * 1000)}`,
                    inline: true
                })

                if (message.guild) var RAWprefix = client.guildSettings.get(message.guild.id)
                if (RAWprefix) var prefix = RAWprefix.prefix
                if (!prefix) var prefix = client.config.prefix
                const usageArray = []
                command.usage
                    .toString()
                    .split(endOfLine)
                    .forEach(usage => {
                        usageArray.push(prefix + usage)
                    })
                exampleEmbed.addFields({
                    name: 'Description:',
                    value: `${command.description}`,
                    inline: true
                }, {
                    name: `Usage${usageArray.length !== 1 ? ` Examples` :""}:`,
                    value: `${usageArray.join("\n")}`,
                    inline: true
                })
                exampleEmbed.setFooter(`Epic gamer moments brought to you by sentry.best`);
                await message.channel.send(exampleEmbed)
            }
        }
    },
}


function helpCmd(embed, message, client, embed2) {
    if (message.guild) embed.setTitle(`Help! |  ${message.member.displayName}`);
    if (!message.guild) embed.setTitle(`Help! |  ${message.author.username}`);
    let ownerOnly = [];
    let regularCommands = [];
    let imgOnly = [];
    var i;
    client.commands.forEach(command => {
        if (command.ownerOnly == true) ownerOnly.push(command.name);
        else if (command.imgCmd == true) imgOnly.push(command.name);
        else regularCommands.push(command.name);
    })
    embed.addField(`Commands [**${regularCommands.length}**]`, "``" + regularCommands.join(`, `) + "``", {
        inline: true
    })
    if (imgOnly) embed.addField(`📷 Image Commands [**${imgOnly.length}**]`, "``" + imgOnly.join(", ") + "``", {
        inline: true
    });
    if (message.author.id == client.config.ownerID) embed.addField(`Owner Only Commands [**${ownerOnly.length}**]`, "``" + ownerOnly.join(", ") + "``", {
        inline: true
    });
    if (!message.guild) {
        embed.setDescription(":books: Command information :book:\nDo " + client.config.prefix + "help ping");
    }
}