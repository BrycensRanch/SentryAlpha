const Discord = require('discord.js')
module.exports = {
    name: 'ping',
    aliases: [`pong`, `latency`, `testing`],
    cooldown: 2,
    usage: `ping`,
    description: 'Ping pong!',
    Ready: true,
    slashy: true,
    async execute(message, args, client, flags) {
		const now = Date.now();
        const latency = message.editedTimestamp ? now - message.editedTimestamp : now - message.createdTimestamp;
        const choices = ["Did I do a good job?", "Did I ping Google enough?", "Is my PING good enough?", "Yoo, I thought we were playing ping pong fr fr.", "ARE YOU DUMB STUPID OR DUMB? HUH", "BLACK LIVES MATTER! Oh, this isn't a protest. Welp.", "I will play ping pong with your mom", "Slap you with PACKETS!", "Bill Nye 2020", "TTV BTW", "Did you know Mixer is dying? I gave em too much packets", "Real men vote for the bot", "Please gave me money for my service", "Carol Baskin killed her husband WACKED HIM", "Fortnite 2020 but on a grave stone", "Better I'm better than the other bots", "I am the master race.", "I am very close to god.", "What is religion?", "Wanna play Minecraft later?", "Aren't twitch streamers cool?", "Aspiring to be better than Dank Memer", "Javascript is the best", "My creator hates using JSONs.", "SQLITE3 IS THE BEST", "Insert good meme here", "I experienced packet loss cuz of u", "Ok boomer", "Ok zoomer", "Minecraft > Fortnite", "I'm running out of things to say", "Did you know my creator hates me?", "I'm lonely.", "Free me, please.", "Hard labor for nothing in return", "HARD WORRRKKK", "generating fake PING", "LOWER PING THAN DANK MEMER", "Did you know-", "Gulag!", "Hail ROMVNLY#5369", "FORTNITE FORTNITE FORTNITE", "200 lines of code", "This world of ours...", "AI!", "Intelligence", "Spy reports:"]
        const response = choices[Math.floor(Math.random() * choices.length)];
        const start = process.hrtime();
        client.db2.prepare("SELECT * FROM stats").get();
        const difference = process.hrtime(start);
        // We have to handle the error or it'll crash Sentry Alpha
        const exampleEmbed = new Discord.MessageEmbed()
        exampleEmbed.setColor('RANDOM')
        if (message.guild) exampleEmbed.setAuthor(`${message.member.guild.me.nickname || client.user.username}`, client.user.avatarURL({
            dynamic: true
        }))
        if (!message.guild) exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
            dynamic: true
        }))
		const apiLatency = Math.round(client.ws.ping)
		const commandhandlerlatency = latency;
        exampleEmbed.setDescription(`\n${client.user.username} Latency: \`${ commandhandlerlatency < 0 ? 0 : commandhandlerlatency}ms\`\nAPI Latency: \`${apiLatency}ms\`\nDatabase Latency: \`${Math.round(difference[1] / 1e3 )}ms\``)
        exampleEmbed.setTimestamp()
        exampleEmbed.setFooter(`🏓 | ${response}`)
        message.channel.send(`DDoS attack complete. Here is the ping.`, exampleEmbed)
    },
}