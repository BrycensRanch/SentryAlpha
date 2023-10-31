const Discord = require('discord.js')
module.exports = {
	name: 'uwu',
	aliases: [`uwuwu`, `uwuuwuwuwuwuwuu`, `uwuDaddy`],
	cooldown: 2,
	usage: `uwu Sentry Alpha is best. Yes yes! am hacker`,
	description: 'Ping pong!',
	async execute(message, args, client) {

				if (!args[0]) {
					args = 'Please provide text for me to uwu!'.split(' ')
				}
				let m = args.join(" ")
				if (message.mentions.members.first()) {
					const mention1 = message.mentions.members.first()
					m = m.replace(`<@!${mention1.id}>`, `${mention1.nickname || mention1.user.username}`)
				}
				if (message.mentions.roles.first()) {
					const mention1 = message.mentions.roles.first()
					m = m.replace(`<@&${mention1.id}>`, `${mention1.name}`)
				}
				message.channel.send(client.utils.uwuify(m))
    },
}
