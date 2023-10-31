

const Discord = require('discord.js')
const system = require('system-commands')
module.exports = {
    name: 'restart',
    ownerOnly: true,
    aliases: [`suicide`, `scooterankle`, `rstart`],
    description: 'Restart command.',
    botPerms: [],
    userPerms: [],
	async execute(message, args, client, flags) {
        if (message.author.id !== client.config.ownerID) return;
        else {
        const token = client.token
        await message.react(`621115161817776129`).catch(err => {
            return;
        })
        var msg = await message.channel.send('Restarting... See ya in a awhile. <:emoji_5:620489474282881054>').catch(err => {
            return;
        })
        if (flags.pm2) {
            client.destroy(client.token)
            return system("pm2 restart index")
        }
        client.destroy(token)
        process.exit(26)
        }
    },
}