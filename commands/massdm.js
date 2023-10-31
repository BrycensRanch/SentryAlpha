const Discord = require('discord.js')
module.exports = {
    name: 'massdm',
    aliases: [`alert`, `notify`],
    cooldown: 86400,
    ownerOnly: true,
    usage: `massdm RAID IS GOING ON! WE NEED YOUR HELP! PLEASE JOIN!`,
    description: 'Alert members of your members role!\nNote: You can only massdm your members role to as a measure to prevent abuse.',
    async execute(message, args, client) {
        //	if (!message.guild) return message.channel.send(`I'm gonna massdm your friends list kid`)
        //	if (!message.member.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`I don't have the MANAGE_MESSAGES permission. This permission ensures the bot is not abused.`)
        //	if (message.author.id !== client.config.ownerID) return message.channel.send(`Yeah... You \`ARE NOT\` ready for the massdm feature.`)
        //	if (!message.member.hasPermission('ADMINISTRATOR') || !message.member.roles.cache.has('696402223214755910')) return message.channel.send(`You don't have permission to massdm. If you believe this is a mistake, contact the guild owner.`)
        //	if (!args[0]) return message.channel.send(`Are you dumb stupid or dumb? HUH? Playing me like a dumby with no command arguments????`);
        //	let db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE); // case INsensitive, without prefix
        //	let query = `SELECT * FROM Settings WHERE guildID = "${message.guild.id}"`
        //	db.get(query, async(err, groupInfo) => {
        //	  const memberRole = groupInfo.member_role
        //	  if (memberRole == 0) return message.channel.send(`Your member role is not setup! Do ${groupInfo.prefix}setup`)
        //	let role = message.guild.roles.cache.get(memberRole)
        //	if(!role) return message.channel.send("Oh no, I couldn't find the member role! Perhaps it was deleted out of existence?\nAnyway, run through your settings and change it to a working role.\nCough cough, ``"+groupInfo.prefix+"settings``.");
        //	let memberarray = role.members.array();
        ////	let membercount = memberarray.length;
        //	let botcount = 0;
        //	let successcount = 0;
        //	console.log(`MassDM triggered by ${message.author.username} (${message.author.id}) :  Sending message to all ${membercount} members of role ${role.name} (Guild ID: ${message.guild.id}).`)
        //	for (var i = 0; i < membercount; i++) {
        //		let member = memberarray[i];
        //		if (member.user.bot) {
        ///			console.log(`Skipping bot with name ${member.user.username}`)
        ///			botcount++;
        ///			continue
        ///		}
        ///		let timeout = Math.floor((Math.random() * (1 - 0.01)) * 1000) + 10;
        //		
        ///		if(i == (membercount-1)) {
        ///			console.log(`Waited ${timeout}ms.\t\\/\tDMing ${member.user.username}`);
        ///		} else {
        //			console.log(`Waited ${timeout}ms.\t|${i + 1}|\tDMing ${member.user.username}`);
        ////		}
        ////			member.send(`${member.user.username}\n${args.join(" ")}\n\n\n\n-${message.guild.name}\nSender: ${message.author.username} (${message.author.id})\nNote: Want to opt out of MassDMs from this server? Easy! React with :x: and I'll never send you a message again. Also, if you're recieving this message late, you can just do /userset massdm false`).catch(err => {
        //				console.log(`--Failed to send DM to ${member.user.username}`)
        ///				return successcount--;
        ////			})
        //			successcount++;
        //	}
        //	console.log(`Sent ${successcount} ${(successcount != 1 ? `messages` : `message`)} successfully, ` +
        //		`${botcount} ${(botcount != 1 ? `bots were` : `bot was`)} skipped.`);
        //		message.channel.send(`Sent ${successcount} ${(successcount != 1 ? `messages` : `message`)} successfully, ` +
        //				`${botcount} ${(botcount != 1 ? `bots were` : `bot was`)} skipped.`)
        //				
        return message.channel.send(`This command has been vaulted until further notice.`)

        //	})
    },
}