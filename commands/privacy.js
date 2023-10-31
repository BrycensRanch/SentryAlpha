const Discord = require('discord.js')
module.exports = {
    name: 'privacy',
    aliases: [`legal`],
    cooldown: 30,
    usage: `legal`,
    description: `Privacy Policy, kinda simple and to the point.`,
    async execute(message, args, client) {
        const legal = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor(`${client.user.username}'s Privacy Policy`, client.user.displayAvatarURL())
            .setDescription(`At High Studios, privacy is one of our highest concerns. We do our best to only collect user information when absolutely necessary and when you remove the bot after 30 days it is purged from our system.\nWe have a 30 day wait for users who'd like to keep their settings and presets after realizing they made a mistake by removing the bot.`)
            .addField(`What data do we collect?`, `We collect guild IDs, guild names, chosen prefixes for guilds, guild owner's IDs and information from the eryn (RoVer API) where we are provided with the guild owner's roblox ID that was last verified with RoVer. This to better the experience of users.\nWe also collect all DMs that are sent to ${client.user.tag} to ensure the bot is not abused via the MassDM feature. We also collect all Donators/Sentry Alpha Premium users for feature expansion and ehance a user's experience. Everytime a command is executed, it is added to our statistics to ensure we know we're doing well.`)
            .addField(`Why do we need this data?`, `We need it for enchancing your experience with our bot and we always have the best in mind and we only collect information necessary for a good experience that we wish to provide all users of ${client.user.tag}.`)
            .addField(`How do we use the data?`, `We use the data for things such as guild prefixes, where you can easily change the prefix of your guild. We only collect guild names to be a guild more identifiable for future reference if we need to change something in the database.`)
            .addField(`Who do we share user data with?`, `Anyone. We only collect simple information, nothing that could possibly harm you if leaked. As the owner of the bot is a scholar in coding and wants to learn more. I cannot promise your data will be kept 100% private. Just keeping it real.`)
            .addField(`Have concerns about the bot? Contact Us.`, `Have any concerns? Join our support server! https://discord.gg/Yx755gU`)
            .addField(`Want your data removed?`, `Just remove the bot and it'll be added to the junk pile that will be deleted after 30 days automatically.`)
            .addField('Important Notice', "This command is just a basic breakdown of the privacy policies that govern Sentry Alpha, please make sure to visit https://sentry.best/privacy for updated policies. It is in your best interest to do so if you wish to keep up to date with our policies.")
            .setTimestamp()
            .setFooter(`Epic gamer moments brought to you by Romvnly.`);
        message.channel.send(`Last updated: 7/8/2020`, legal)
            .catch(err => {
                message.author.send(`Last updated: 7/8/2020`, legal)
                    .catch(err => {
                        return;
                    })
            })
    },
}