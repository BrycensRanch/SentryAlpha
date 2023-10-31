const Discord = require('discord.js');
const UtilsRAW = require(`../Util/ClientUtil`);
const Utils = new UtilsRAW();
const Canvacord = require("canvacord");
module.exports = {
	name: 'wanted',
	aliases: [],
	cooldown: 2,
	imgCmd: true, 
	Ready: true, 
	usage: `wanted Foundtain Information`,
	description: "Wanted for 25k or more.",
	async execute(message, args, client) {
				if (message.guild) var mentionedUser = Utils.resolveMember(args.join(" "), message.guild.members.cache, {caseSensitive: false, wholeWord: false})
				if (mentionedUser) mentionedUser = mentionedUser.user
				if (!message.guild) mentionedUser = message.author
				if (mentionedUser && mentionedUser.id == client.user.id)  message.channel.send("You're damn right I'm wanted.")
				if (!mentionedUser) {
					mentionedUser = message.author
				}
				if (!args[0]) {
					mentionedUser = message.author
				}
				let avatar = mentionedUser.displayAvatarURL({ dynamic: false, format: 'png' });
				let image = await Canvacord.Canvas.wanted(avatar);
				let attachment = new Discord.MessageAttachment(image, "wanted.png");
				return message.channel.send(attachment);
    },
}
