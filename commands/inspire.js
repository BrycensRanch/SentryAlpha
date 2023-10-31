const Discord = require('discord.js')
const axios = require(`axios`)
module.exports = {
    name: 'inspire',
    aliases: [`inspireme`],
    cooldown: 4,
    usage: `inspireme`,
    description: 'Inspire yourself to keep going and do better.',
    async execute(message, args, client) {
        const msg = await message.channel.send("Stealing good quotes to inspire you...")
        await axios.get(`https://type.fit/api/quotes`)
            .then(async function (response) {
                const exampleEmbed = new Discord.MessageEmbed()
                exampleEmbed.setColor('RANDOM')
                const quoteRAW = response.data[Math.floor(Math.random() * response.data.length)]
                const quote = quoteRAW.text
                const author = quoteRAW.author
                if (message.guild) exampleEmbed.setAuthor(`${message.member.guild.me.nickname || client.user.username}`, client.user.avatarURL({
                    dynamic: true
                }))
                if (!message.guild) exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
                    dynamic: true
                }))
                exampleEmbed.setDescription(`A quote for you. There is a quote for everyone.`)
                exampleEmbed.addField(`📌 Inspirational Quote:`, `${quote}\n- **${author}**`)
                exampleEmbed.setFooter(`🎇 | Out of ${response.data.length} quotes, you were given this one. Remember this.`)
                msg.edit(`Found a good quote just for you.`)
                msg.edit(exampleEmbed)
            })
            .catch(async err => {
                console.error(err)
                await msg.edit(`Oh no, a error has occured with my epic quote system!`)
            })
    },
}