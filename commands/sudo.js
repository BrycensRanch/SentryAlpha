const Discord = require('discord.js')
module.exports = {
	name: 'sudo',
	aliases: [],
	cooldown: 0,
	usage: `sudo @Random balance`,
	description: 'Force a user to run a command.\nIgnores cooldowns',
	Ready: true,
	ownerOnly: true,
	guildOnly: true,
	NoSudo: true,
	async execute(message, args, client) {
		if (!client.botAdmins.includes(message.author.id)) return;
		if (!args[0]) return message.channel.send("Give me a user to force to use a command!")
		if (!args[1]) return message.channel.send("Give me a command to sudo!")
		if (!client.commands.has(args[1]) && !client.aliases.has(args[1])) return message.channel.send("The command provided is either not loaded or does not exist.")
			var mentionedUser = client.utils.resolveMember(args[0], message.guild.members.cache.filter(x => !x.user.bot), false, false)
		if (!mentionedUser) return message.channel.send("That is not a valid user")
		var msg = message 
		var cmd = client.commands.get(args[1])
		if (!cmd) cmd = client.aliases.get(args[1])
		if (cmd.name == module.exports.name) return message.channel.send("You may not sudo the sudo command!")
		if (cmd.NoSudo) return message.channel.send("This command cannot be sudoed!")
		msg.author = mentionedUser.user 
		msg.member = mentionedUser
		msg.createdTimestamp = new Date().getTime()
		var args2 = args.filter(x => x !== args[0] && x !== args[1])
		cmd.execute(msg, args2, client, {}, args2, {sudo: true})		
		.catch(err => {
			console.error(err);
			message.reply(`there was an error trying to execute that command! ${client.botAdmins.includes(message.author.id) ? `Please check the console for further details.` : `If this error persistents, contact our support team which can be found on the \`\`invite\`\` command.`}`).catch(err => {
			  message.author.send(`There was a possible error caused by lack of permissions.`).catch(err => {
				return;
			  })
			})
		  })
    },
}
