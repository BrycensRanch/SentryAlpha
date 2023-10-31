

const Discord = require('discord.js')
module.exports = {
    name: 'load',
    ownerOnly: true,
    aliases: [`unvault`],
    type: "base",
	description: 'Load a command.',
	async execute(message, args, client) {
        if (message.author.id !== client.config.ownerID) return await message.reply(`Go away`)
        if (!args[0]) return message.channel.send(`Provide a commands to Load, noob.`)
        let success = []
        let failure = []
        message.channel.startTyping()
        for (var commandName of args) {
            commandName = commandName.toLowerCase()
            if (commandName.endsWith(".js")) commandName = commandName.substring(0, commandName.length - 3)
            try {
                const fs  = require(`fs`)
                const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const command of commands) {
                    //check each file for the specified args
                    const fileCheck = require(`./${command}`)
                    if (fileCheck.name == commandName) {
                        commandName = command.slice(0, -3)
                    }
                }
                const pull = require(`./${commandName}.js`)
                client.commands.set(commandName, pull)
                for (const newAlias of pull.aliases) {
                    client.aliases.set(newAlias, pull)

                }
                success.push(commandName)
                
            }
            catch(e) {
                failure.push(commandName)
                console.error(e.message)
            }
        }
        message.channel.stopTyping()
        const reloadEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${client.user.username} Load System`, client.user.avatarURL())
        .setDescription(`Successfully loaded ${success.length || 0} command(s)\nFailed to Load ${failure.length || 0} command(s)`)
        if (success.length) reloadEmbed.addField(`Successfully Loaded:`, `\`${success.join(", ")}\``)
        if (failure.length) reloadEmbed.addField(`Failed to Load:`, `\`${failure.join(", ")}\``)
        if (failure.length) reloadEmbed.addField(`Note:`, `\`Check console for more details on errors.\``)
        return message.channel.send(reloadEmbed)
    },
}