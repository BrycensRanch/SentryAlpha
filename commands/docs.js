const Discord = require('discord.js')
const axios = require("axios");

module.exports = {
    name: 'docs',
    aliases: [`discordjs`, 'discord.js', 'djs', 'js'],
    cooldown: 2,
    usage: `docs GuildMember`,
    category: "Utilities",
    description: `Look up shit on discord.js.org's docs.`,
    async execute(message, args, client) {
        if (!args[0]) return message.channel.send("Ay, give me args to look up on the docs no one read")
        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(" "))}`;

        const docFetch = await fetch(url);
        const embed = await docFetch.json();
        if (!embed || embed.error) {
            return message.reply(`"${args.join(" ")}" couldn't be located within the discord.js documentation (<https://discord.js.org/>).`, {
                disableMentions: "all"
            });
        }

        const msg = await message.channel.send({
                embed
            })
            .catch(() => null);
        if (!message.guild || message.channel.permissionsFor(message.guild.me)
            .serialize()
            .ADD_REACTIONS) {

            msg.react("⛔");

            let react;
            try {
                react = await msg.awaitReactions(
                    (reaction, user) => reaction.emoji.name === "⛔" && user.id === message.author.id, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }
                );
            } catch (error) {
                msg.reactions.removeAll()
                    .catch(() => null);
            }

            if (react && react.first()) {
                msg.delete()
                    .catch(() => null);
                message.delete()
                    .catch(() => null);
            }
        }
    }
}