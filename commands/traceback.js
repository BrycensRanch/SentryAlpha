const Discord = require('discord.js')
module.exports = {
    name: 'traceback',
    aliases: [`trace`],
    cooldown: 2,
    ownerOnly: true,
    usage: `traceback`,
    description: 'Get the latest unhandled error.',
    async execute(message, args, client) {
        if (message.author.id !== client.config.ownerID) return;
        if (!client.error || !client.error.first()) return message.channel.send(`No errors to trace!`)
        const msg = await message.author.send("Getting lastest error...")
        if (message.guild) await message.channel.send(`I have sent you the most recent error in your DMs.`)
        const error = client.error.first()
            .toString();
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`${client.user.tag}`, client.user.avatarURL({
                dynamic: true
            }))
            .setDescription(`\`\`\`js\n${error.length  > 1950 ? await client.utils.post(error) : error}\n\`\`\``)
            .setTimestamp()
            .setFooter(`${Array.from(client.error.keys())[0].length > 20 ? Array.from(client.error.keys())[0].substr(0, 20) + "...": Array.from(client.error.keys())[0]}`)
        msg.edit(`:bar_chart: **Statistics**:\n There have been \`${client.error.size}\` handled errors that have occured since the bot has began running.\n\`${Array.from(client.error.keys()).filter(key => key.startsWith("EXPRESS-")).length}\` errors have been spawned by Express.js\nTraceback: `, exampleEmbed)
            .catch(() => {
                message.author.send("There was an error sending the stack trace for this error.")
            })
    },
}