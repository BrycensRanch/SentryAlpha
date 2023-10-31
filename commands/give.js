const Discord = require('discord.js')
const Humanize = require(`humanize-plus`); // $Humanize.compactInteger(user.balance, 1) | 1K
const {
    deFormat
} = require('friendly-numbers');
module.exports = {
    name: 'give',
    aliases: [`g`, `banktransfer`, `transfer`],
    cooldown: 1,
    Ready: true,
    guildOnly: true,
    usage: `give Romvnly 10k\ngive "Cool Kid" 10000\ngive "COOKIE MAN" 10,000,000`,
    description: 'Give da moneyz to a another user!',
    async execute(message, args, client, flags, parsedArgs) {
        if (!parsedArgs[0]) {
            parsedArgs[0] = message.member.toString()
        }
        var mentionedUser = client.utils.resolveMember(parsedArgs[0], message.guild.members.cache, false, false)
        if (!mentionedUser) {
            mentionedUser = message.member
        }
        if (mentionedUser.user.bot) return message.channel.send("You may not give coins to bots, they don't care how much you give them, they'll never be your friend.")
        if (mentionedUser.user.id == message.author.id) return message.channel.send("You may not transfer money to yourself, no infinite money glitches here.")
        if (!parsedArgs[1]) return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RED")
            .setDescription(`You didn't provide a amount to give/transfer to ${mentionedUser.toString()}. Please try this command again with the amount you want to transfer or don't come back at all!`)
        )

        const formattedBalance = parsedArgs[1].toUpperCase()
            .replace(/,/g, '');;
        const amount = deFormat(formattedBalance); // For our database, the parsed amount
        if (isNaN(amount)) return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RED")
            .setDescription(`${parsedArgs[1]} is not an number!`)
        )
        if (amount == 0) return message.channel.send(new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Haha, very funny... What are you supposed to do, give ${mentionedUser.toString()} nothing? Keep it moving.`)
        )
        if (amount < 0) return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RED")
            .setDescription("What the frick do you think this is? You can't give negative numbers to people!")
        )
        if (amount == Infinity) return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RED")
            .setDescription("What did I say about infinite money glitches? They don't work. Nice try though!")
        )
        const currentAmount = await client.getBal(message.author.id)
        if (!currentAmount && client.config.defaultMoney < amount || currentAmount && parseInt(currentAmount.balance) < amount) return message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RED")
            .setDescription(`Woah woah, you don't have ${Humanize.compactInteger(amount, 0)} to give to ${mentionedUser.toString()}! You're missing **${currentAmount ? Humanize.intComma(amount - currentAmount.balance)  : Humanize.intComma(amount - client.config.defaultMoney)}** Bobux!`)
        )
        const targetUserBalRAW = await client.getBal(mentionedUser.id)
		if (targetUserBalRAW) var targetUserBal = parseInt(targetUserBalRAW.balance)
		
        if (!targetUserBalRAW || targetUserBalRAW && targetUserBalRAW.balance !== "Infinity")await client.setBal(mentionedUser.id, targetUserBal + amount || client.config.defaultMoney + amount)
        if (!currentAmount || currentAmount && currentAmount.balance !== "Infinity")await client.setBal(message.author.id, currentAmount ? parseInt(currentAmount.balance) - amount : client.config.defaultMoney - amount)
        client.setEcoLog(mentionedUser.id, targetUserBalRAW ? amount : amount, `Money transfer from ${message.member.displayName} (${message.author.tag} ID: ${message.author.id})`)
        client.setEcoLog(message.author.id, currentAmount ? -amount : -Math.abs(amount), `Money transfer to ${mentionedUser.displayName} (${mentionedUser.user.tag} ID: ${mentionedUser.user.id})`)
        const giveEmbed = new Discord.MessageEmbed()
        .setColor(mentionedUser.displayHexColor || "GREEN")
        .setAuthor(mentionedUser.displayName, mentionedUser.user.displayAvatarURL({dynamic: true}))
        .setTitle(`:moneybag: | Balance Transfer between ${message.member.displayName} and ${mentionedUser.displayName}!`)
        .setDescription(`Successfully transfered **${Humanize.compactInteger(amount, 1)}** to ${mentionedUser.toString()}.`)
        .addField(`${mentionedUser.displayName}'s Balance:`, `${targetUserBalRAW ? targetUserBalRAW.balance !== "Infinity" ? Humanize.compactInteger(parseInt(targetUserBalRAW.balance) + amount, 1) : "**Infinite**, they're still chilling." : Humanize.compactInteger(client.config.defaultMoney + amount, 1)}`)
        giveEmbed.addField(`Your Balance:`, `${currentAmount ? currentAmount.balance !== "Infinity" ? Humanize.compactInteger(parseInt(currentAmount.balance) - amount, 1) : "**Infinite**, you're still chilling." : Humanize.compactInteger(client.config.defaultMoney - amount)}`)
        message.channel.send(giveEmbed)

    },
}