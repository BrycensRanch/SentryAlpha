

const Discord = require('discord.js');
const fs  = require(`fs`);
const path  = require("path");
const {findFile, getFiles} = require("../register");
const system = require("system-commands");
module.exports = {
    name: 'reload',
    ownerOnly: true,
    category: "Util",
    type: "base",
    aliases: [`rload`, `fdsdffsdsfd`, `re`, `re2`],
	description: 'Reload a command.',
	async execute(message, args, client) {
        if (message.author.id !== client.config.ownerID) return await message.reply(`Go away`);
        if (!args[0]) return message.channel.send(`Provide a commands to reload, noob.`);
        let success = [];
        let failure = [];
        let warnings = [];
        message.channel.startTyping();
        switch(args.join(" ").toLowerCase()) {
            case "all events": case "events": case "eventz": {
                    const events = await getFiles("./events");
                    for (const event of events.filter(file => file.endsWith(".js"))) {
                        const eventName = path.basename(event).slice(0, -path.extname(event).length);
                        try {
                            delete require.cache[require.resolve(event)];
                            const eventModule = require(event);
                            client.removeListener(eventName, client.listeners(eventName)[0]);
                            client.on(eventName, eventModule.bind(null, client));
                            success.push(eventName);
                        }
                        catch(e) {
                            failure.push(eventName);
                            console.error(e.stack || e.message || e);
                        }
                }
                break;
            }
            case "bot": case "sentry alpha": case "client": {system(`pm2 reload ${process.env.name}`); success.push(client.user.tag); break; }
            case "utils": case "client.utils": case "util": {
                delete require.cache[require.resolve("../Util/ClientUtil")];
                const UtilsRAW = require("../Util/ClientUtil");
                const Utils = new UtilsRAW();
                client.utils = Utils;
                success.push("Utils");
                break;
            }
            case "all commands": case "all cmds": case "cmds": {
                    const cmds = await getFiles("./commands");
                    for (const cmd of cmds.filter(file => file.endsWith(".js"))) {
                        const cmdFileName = path.basename(cmd).slice(0, -path.extname(path.basename(cmd)).length); // Command name without any extensions
                            const oldCache = require(cmd);
                            for (alias of oldCache.aliases) {
                                client.aliases.delete(alias);
                            }
                        delete require.cache[require.resolve(cmd)];
                        client.commands.delete(oldCache ? oldCache.name : cmdFileName);
                        
                }
                delete require.cache[require.resolve('../modules.json')];
                client.CommandHandler.registerCommands()
                console.log([...client.commands.values()].map(({name})=> name))
                for (newCommand of client.commands) {
                    console.log(newCommand.name)
                    success.push(newCommand.name)
                }
                console.log(client.commands)
                break;
            }
            case "bot-config": case "client-config": case "config-file": case "client.config": {
                try {
                    delete require.cache[require.resolve(`../config.json`)];
                    client.config = require(`../config.json`);
                    success.push("config.json");
                }
                catch(e) {
                    failure.push("config.json");
                    console.error(e.stack || e.message || e);
                }
                break;
            }
            default: {
                for (var commandName of args) {
                    if (commandName.toLowerCase() == "event" && args[args.indexOf(commandName) + 1]) {
                        const eventWithExt = args.join(" ").slice(args[0].length + 1) +`${!args.join(" ").toLowerCase().endsWith(".js") ? ".js": +""}`;
                        var eventName = args.join(" ").slice(args[0].length + 1);
                        try { 
                            const event = await findFile(eventWithExt, "./events", false);
                            if (!event) {
                                failure.push(eventName.trim() || args[0]);
                                console.trace(`${eventName.trim() || args[0]} not found!`);
                                break;
                            }
                            eventName = path.basename(event).slice(0, -path.extname(event).length)
                            console.log(eventName, event)
                            delete require.cache[require.resolve(event)];
                            const eventModule = require(event);
                            client.removeListener(eventName, client.listeners(eventName)[0]);
                            client.on(eventName, eventModule.bind(null, client));
                            success.push(eventName);
                        }
                        catch(e) {
                            failure.push(eventName);
                            console.error(e.stack || e.message || e); 
                        }
                        break;
                    }
                    else if (commandName.toLowerCase() == "cmd" && args[args.indexOf(commandName) +1 ]) {
                        try {
                            if (client.commands.has(commandName)) commandName = client.commands.get(commandName).filepath;
                            if (client.aliases.has(commandName)) commandName = client.aliases.get(commandName).filepath;
                            const commandFile = await findFile(path.basename(commandName), "./commands");
                            if (commandFile) commandName = commandFile;
                            const oldCache = require(commandName)
                                for (alias of oldCache.aliases) {
                                    client.aliases.delete(alias);
                                }
                            delete require.cache[require.resolve(commandName)];
                            client.commands.delete(oldCache.name);
                            const pull = require(commandName);
                            pull.filepath = commandName;
                            client.commands.set(pull.name || path.basename(commandName).slice(0, -3), pull);
                            for (const newAlias of pull.aliases) {
                                client.aliases.set(newAlias, pull);
                            }
                            success.push(path.basename(commandName).slice(0, -path.extname(commandName).length) || commandName);
                        }
                        catch(e) {
                            failure.push(path.basename(commandName).slice(0, -path.extname(commandName).length))
                            console.error(e.stack || e.message || e);
                        }
                        break;
                    }
                    else {
                        commandName = commandName.toLowerCase();
                    
                        try { // Now based upon file Paths
                            if (client.commands.has(commandName)) commandName = client.commands.get(commandName).filepath;
                            if (client.aliases.has(commandName)) commandName = client.aliases.get(commandName).filepath;
                            const commandFile = await findFile(path.basename(commandName), "./commands");
                            if (commandFile) commandName = commandFile;
                            const oldCache = require(commandName)
                                for (alias of oldCache.aliases) {
                                    client.aliases.delete(alias);
                                }
                            delete require.cache[require.resolve(commandName)];
                            client.commands.delete(oldCache.name);
                            const pull = require(commandName);
                            pull.filepath = commandName;
                            client.commands.set(pull.name || path.basename(commandName).slice(0, -3), pull);
                            for (const newAlias of pull.aliases) {
                                client.aliases.set(newAlias, pull);
                            }
                            success.push(path.basename(commandName).slice(0, -path.extname(commandName).length) || commandName);
                        }
                        catch(e) {
                            failure.push(commandName);
                            console.error(e.stack || e.message || e);
                            
                        }
                    }
                    }
                    break;
            }
        } 

        const reloadEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${client.user.username} Reload System`, client.user.avatarURL())
        .setDescription(`Successfully reloaded ${success.length || 0} command/event(s)\nFailed to reload ${failure.length || 0} command/event(s)`)
        if (success.length) reloadEmbed.addField(`Successfully reloaded:`, `${success.join(", ").length > 1000 ? '' : `\``}${success.join(", ").length > 1000 ? await client.utils.post(`${client.user.tag} successfully loaded these modules:\n - ${success.join("\n - ")}`) : success.join(", ") }${success.join(", ").length > 1000 ? '' : `\``}`);
        if (failure.length) reloadEmbed.addField(`Failed to reload:`, `${failure.join(", ").length > 1000 ? '' : `\``}${failure.join(", ").length > 1000 ? await client.utils.post(`${client.user.tag} failed to reload these modules:\n - ${failure.join("\n - ")}`) : failure.join(", ")}${failure.join(", ").length > 1000 ? '' : `\``}`);
        if (warnings.length) reloadEmbed.addField(`Warnings:`, `${warnings.join(", ").length > 1000 ? '' : `\``}${warnings.join(", ").length > 1000 ? await client.utils.post(`${client.user.tag} threw these warnings :\n - ${warnings.join("\n - ")}`) : warnings.join(", ")}${warnings.join(", ").length > 1000 ? '' : `\``}`);
        if (failure.length) reloadEmbed.addField(`Note:`, `\`Check console for more details on errors.\``);
        message.channel.stopTyping(true);
        return await message.channel.send(reloadEmbed);
    },
}