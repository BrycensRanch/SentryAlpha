

const Discord = require('discord.js')
module.exports = {
    name: 'unload',
    ownerOnly: true,
    aliases: [`vault`],
	description: 'Unload a command.',
    unloadCommands(args, client) {
        let success = []
        let failure = []
        for (var commandName of args) {
            commandName = commandName.toLowerCase()
            try {
                const reloadAlias = client.aliases.get(commandName)
                if (reloadAlias) {
                    commandName = reloadAlias.name
                }
                const fs  = require(`fs`)
                const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const command of commands) {
                    //check each file for the specified args
                    const fileCheck = require(`./${command}`)
                    if (fileCheck.name == commandName) {
                        commandName = command.slice(0, -3)
                    }
                }
                if (client.categories.has(commandName)) client.categories.delete(commandName)
                const oldCache = require(`./${commandName}.js`)
                for (alias of oldCache.aliases) {
                    client.aliases.delete(alias)
                }
                delete require.cache[require.resolve(`./${commandName}.js`)]
                client.commands.delete(commandName)
                success.push(commandName)

            }
            catch(e) {
                failure.push(commandName)
                console.log(e.message)
            }
        }
        return {
            success,
            failure
        }
    },
	async execute(message, args, client) {
        if (message.author.id !== client.config.ownerID) return await message.reply(`Go away`)
        if (!args[0]) return message.channel.send(`Provide a commands to unload, noob.`)
        message.channel.startTyping()
        const {success, failure} = this.unloadCommands(args, client)
        message.channel.stopTyping()
        const unloadEmbed = new Discord.MessageEmbed()
        unloadEmbed.setColor('RANDOM')
        unloadEmbed.setTitle(`${client.user.username} Unload System`, client.user.avatarURL())
        unloadEmbed.setDescription(`Successfully unloaded ${success.length || 0} command(s)\nFailed to Unload ${failure.length || 0} command(s)`)
        if (success.length) unloadEmbed.addField(`Successfully Unloaded:`, `\`${success.join(", ")}\``)
        if (failure.length) unloadEmbed.addField(`Failed to Unload:`, `\`${failure.join(", ")}\``)
        if (failure.length) unloadEmbed.addField(`Note:`, `\`Check console for more details on errors.\``)
        return message.channel.send(unloadEmbed)
    },
}