const Discord = require('discord.js')
module.exports = {
    name: 'embed',
    aliases: [],
    cooldown: 2,
    botPerms: ["EMBED_LINKS"],
    usage: `embed Rule 1 of Secret Fight Club, tell no one about Secret Fight Club <:PandaKiller:727739916578193449>`,
    description: "Make a simple embed!",
    async execute(message, args, client) {

        if(!args[0]) return message.channel.send(`im gonna embed you into this wall if you dont give me something to embed`)
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
        if(message.guild) exampleEmbed.setAuthor(`${message.member.nickname || message.author.username}`, message.author.avatarURL())
        if(!message.guild) exampleEmbed.setAuthor(`${message.author.username}`, message.author.avatarURL())
        exampleEmbed.setDescription(`${args.join(" ")}`)
        exampleEmbed.setTimestamp()
        exampleEmbed.setFooter(`Join Sentry Alpha Premium today for the ability to create a embed just like this!`, client.user.avatarURL({
            dynamic: true,
            format: 'png'
        }));
        message.delete().catch(err => {
            return;
        })
        message.channel.send(exampleEmbed)

    },
}