const Discord = require('discord.js')
const cleverbot = require("cleverbot-free");
module.exports = {
    name: 'talk',
    aliases: [`ask`, `bot`],
    cooldown: 2,
    usage: `talk I am epic?`,
    description: 'Talk with me. PLZ',
    async execute(message, args, client) {
        if(!args[0]) return message.channel.send("Hey, give me something to work with! I'm not a conversation starter, you are!")
        if(args.join(" ") == 'your a creep') return message.channel.send('No you!')
        const response = await cleverbot(`${args.join(" ")}`, client.talks.filter(x => x.person == message.author.id).map(x => x.msg))
                client.talks.set(Date.now(), {
                    msg: args.join(" "),
                    person: message.author.id
                })
        message.reply(response)

    },
}