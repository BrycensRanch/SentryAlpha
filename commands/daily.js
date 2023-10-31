const Discord = require('discord.js')
const Humanize = require(`humanize-plus`);
module.exports = {
    name: 'daily',
    aliases: [`day`, `hourly`, `payday`],
    cooldown: 86400, // 24 hours in seconds
    Ready: true,
    persist: true,
    usage: `daily`,
    description: 'Get your daily coins!',
    async execute(message, args, client, flags, parsedArgs) {
        const bal = await client.getBal(message.author.id)
        const amountToGive = bal && bal.multi ? client.randomNumber(25, 950) * bal.multi : client.randomNumber(25, 950)
        if (!bal || bal && bal.balance !== "Infinity") await client.setBal(message.author.id, bal ? parseInt(bal.balance) + amountToGive : client.config.defaultMoney + amountToGive)
        client.setEcoLog(message.author.id, amountToGive, `Daily Coins!`)
        message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTitle(`💸 | Daily Coins`)
            .setColor("GREEN")
            .setDescription(`You have successfully redeemed your daily coins! ${bal && bal.multi ? `Thanks to your **${bal.multi}x** multipler, you now have been given **${amountToGive}** coins! Usually, you'd be given **${amountToGive / bal.multi }** coins!` : `You have been given **${amountToGive}** coins!`}`)
            .addField(`Your Balance:`, `${bal ? bal.balance !== "Infinity" ? Humanize.compactInteger(parseInt(bal.balance) + amountToGive, 1) : "**Infinite**, you're still chilling." : Humanize.compactInteger(client.config.defaultMoney + amountToGive)}`)
        )
    },
}