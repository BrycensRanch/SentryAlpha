const EventEmitter = require('events');
const Discord = require('discord.js');
const SentryClient = require("../SentryClient");
const fs = require("fs")
    .promises;
const path = require("path");
const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const humanizeDuration = require("humanize-duration");
const stringSimilarity = require("string-similarity");
const unloadedModules = require("../modules.json");
const colors = require('colors');
const logger = require('../logger')

/** Top donkey command handler class */
class CommandHandler extends EventEmitter {
    /**
     * Top donkey command handler
     * @param {SentryClient} client - The discord.js this.client instance to run on.
     * @param {string} botPrefix - The prefix of the bot.
     * @param {string} commandsDir - The directory where all the commands are located.
     * @param {string} eventsDir - The directory where all the events are located.
     */
    constructor(client, botPrefix = "s!", commandsDir = '../commands', eventsDir = '../events', regexDir = '../regexes') {
        super();
        Object.defineProperty(this, "client", {
            enumerable: false,
            writable: true,
            value: client
        });
        this.commandsDir = commandsDir;
        this.eventsDir = eventsDir;
        this.regexDir = regexDir;
        this.botPrefix = client.config.prefix;
        if (!this.client) throw new TypeError('No discord.js this.client provided!');
        if (typeof this.client !== 'object') throw new TypeError('The discord.js this.client must be an class/object.');
        if (!this.client instanceof SentryClient) throw new TypeError('The supplied this.client is not an instance of SentryClient.');
        if (!this.commandsDir) throw new TypeError('No commands directory provided!');
        if (typeof this.commandsDir !== 'string') throw new TypeError('The commands Directory must be a string.');
        if (!this.eventsDir) throw new TypeError('No events directory provided!');
        if (typeof this.eventsDir !== 'string') throw new TypeError('The events Directory must be a string.');
        if (!this.client.commands || !this.client.commands instanceof Discord.Collection) this.client.commands = new Discord.Collection();
        if (!this.client.aliases || !this.client.aliases instanceof Discord.Collection) this.client.aliases = new Discord.Collection();
        if (!this.client.botAdmins || !Array.isArray(this.client.botAdmins)) this.client.botAdmins = [];
    }
    /**
     * Resolve a command from a string
     * @param {string} command - The command to resolve.
     * @return {object} command -The command resolved, if any.
     */
    resolveCommand(command, message) {
        var cmd;
        if (this.client.commands.has(command)) {
            cmd = this.client.commands.get(command);
        } else {
            cmd = this.client.aliases.get(command);
            if (message.guild && !cmd) {
                let guildSetting = this.client.guildConfigs.get(message.guild.id)
                if (guildSetting && guildSetting.spellcheck) {
                    var matches = stringSimilarity.findBestMatch(command, this.client.commands.map(x => x.name));
                    if (matches.bestMatch.rating < 0.6) return;
                    const goodMatches = []
                    matches.ratings.forEach((match) => {
                        if (match.rating < 0.6) return
                        goodMatches.push(match.target)
                    })
                    const SpellCheck = new Discord.MessageEmbed() // Spell check for possibly misspelled commands for guilds only for now..
                        .setColor('RANDOM')
                        .setAuthor(`${this.client.user.username} Spell Check`, message.author.avatarURL())
                        .setDescription(`Possible matches for your mispelled command.\nI have found ${goodMatches.length} possible matche(s) for your misspell.\n\n**${goodMatches.join(",\n")}**\n\nIf you'd like this **disable this feature**, do ${this.client.name}config SpellCheck OFF`)
                        .setTimestamp()
                        .setFooter(`Not the best with spelling? It's okay. :)`);
                    message.reply(`Did you mean the command \`${matches.bestMatch.target}\`?`, SpellCheck)
                        .catch(() => null);
                    return null;
                }
            }
        }
        return cmd;
    }
    /**
     * Is user blacklisted?
     * @param {Discord.User} user
     * @return {boolean} 
     */
    isBlacklisted(user) {
        return this.client.blacklist.has(user.id)
    }
    /**
     * This function splits spaces and creates an array of object defining both the type of group (based on quotes) and the value (text) of the group.
     * @param string The string to split.
     * @see parse
     */
    parseDetailed(string) {
        const groupsRegex = /[^\s"']+|(?:"|'){2,}|"(?!")([^"]*)"|'(?!')([^']*)'|"|'/g;

        const matches = [];

        let match;

        while ((match = groupsRegex.exec(string))) {
            if (match[2]) {
                // Single quoted group
                matches.push({
                    type: "single",
                    value: match[2]
                });
            } else if (match[1]) {
                // Double quoted group
                matches.push({
                    type: "double",
                    value: match[1]
                });
            } else {
                // No quote group present
                matches.push({
                    type: "plain",
                    value: match[0]
                });
            }
        }

        return matches;
    }
    /**
     * This function splits spaces and creates an array of strings, like if you were to use `String.split(...)`, but without splitting the spaces in between quotes.
     * @param string - The string to split.
     * @see parseDetailed
     */
    parse(string) {
        return this.parseDetailed(string)
            .map((details) => details.value);
    }
    async getFiles(dir) {
        const dirents = await fs.readdir(dir, {
            withFileTypes: true
        });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getFiles(res) : res;
        }));
        return Array.prototype.concat(...files);
    }
    async findFile(name, dir, casesensitive = true) {
        const files = await this.getFiles(dir)
        for (const file of files) {
            if (casesensitive) {
                if (path.basename(file) == name) return file;
            } else {
                if (path.basename(file)
                    .toLowerCase() == name.toLowerCase()) return file;
            }
        }
    }
    setEditable(message) {
        Discord.TextChannel.prototype.send = async function (content, options) {

            if (this instanceof Discord.User || this instanceof Discord.GuildMember) {
                return this.createDM()
                    .then(dm => dm.send(content, options));
            }

            let apiMessage;

            if (content instanceof Discord.APIMessage) {
                apiMessage = content.resolveData();
            } else {
                apiMessage = Discord.APIMessage.create(this, content, options)
                    .resolveData();
                if (Array.isArray(apiMessage.data.content)) {
                    return Promise.all(apiMessage.split()
                        .map(this.send.bind(this)));
                }
            }

            const {
                data,
                files
            } = await apiMessage.resolveFiles();
            return this.client.api.channels[this.id].messages
                .post({
                    data,
                    files
                })
                .then(d => {
                    const msg = this.client.actions.MessageCreate.handle(d)
                        .message
                    this.client.prompts.set(message.id, msg.id)
                    return msg;
                });
        }
    }
    /**
     * Handles a command from a message event. (Does not support message edits)
     * @param {Discord.Message} message
     * @return {object} - The command resolved, if any.
     */
    async handleCommand(message) {
        if (message && message.partial) message = await message.fetch()
            .catch(() => null);
        if (!message) return; // If we're given a partial deleted message, don't do anything with it! It's useless anyway!
        if (message.author.bot == true) return;
        if (message.type !== "DEFAULT") return; // Only regular user messages.
        if (message.guild && !message.channel.permissionsFor(message.guild.me)
            .serialize()
            .SEND_MESSAGES)
            return; // If the bot can't send messages to the channel, ignore.
            for (const regex of Array.from(this.client.regexes.values())) {
                if (regex.regex.test(message.content)) {
                      await regex.execute(message, this.client).catch(e => {
                        throw e || new Error(`Unknown error`)
                    });
                } 
            }
        this.setEditable(message);
        // If there is any custom guild prefixes, fetch from the database and redefine the botPrefix to their custom prefix for the server.
        if (message.guild) var guildInfo = this.client.guildSettings.get(message.guild.id); // guildSettings: {"guildID":"638036514214772737","guildName":"Vultrex Development","premium":false,"prefix":"sa!"}
        if (guildInfo) this.botPrefix = guildInfo.prefix
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(this.botPrefix)}|${this.client.user.username},)\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const {
            args,
            flags
        } = this.parseFlags(message.content.slice(matchedPrefix.length)
            .trim()
            .split(/ +/)); // The flags are parsed and also returns back the arguments without the flags in them!
        const command = args.shift()
            .toLowerCase(); // This shouldn't be changed... AT ALL. This is what triggered the command.
        args.executor = command;
        const parsedArgs = this.parse(args.join(" ")); // This allows arguments like 'ARGUMENT WITH SPACES' to be interpreted as one argument.
        try {
            var cmd;
            try {
                cmd = this.resolveCommand(command, message);
            } catch (e) {
                logger.error(e);
                cmd = undefined
            }
            if (!cmd) return;
            if (this.isBlacklisted(message.author)) return message.reply(new Discord.MessageEmbed()
                    .setColor('RED')
                    .setAuthor(`${this.client.user.username} Blacklist`, message.author.avatarURL())
                    .setDescription(`It seems as you have been blacklisted from ${this.client.user.username}! If you believe this is a mistake, join our [support server](https://discord.gg/Yx755gU) to get this cleared up. `)
                    .setTimestamp()
                    .setFooter(`You're officially... CANCELLED!`))
                .catch(() => null);
            if (cmd.ownerOnly && !this.client.botAdmins.includes(message.author.id)) return; // Do not reply to commands such as eval...
            var greatweGood = false;
            const reallyneededPerms = [];
            const greatPerms = [];
            const trashPerms = [];
            if (message.guild && cmd.userPerms && !flags.bypass) { // PERMISSION CHECKING IF THERE IS A GUILD
                for (const perm of cmd.userPerms) {
                    logger.log(`Permission check for ${cmd.name} | ${perm}`)

                    if (message.channel.permissionsFor(message.author)
                        .serialize(false)[perm] === undefined) {
                        trashPerms.push(perm)
                        greatweGood = false;
                    }

                    if (message.channel.permissionsFor(message.author)
                        .serialize(false)[perm] == false) {
                        greatweGood = false;
                        reallyneededPerms.push(await this.client.utils.convertReadable(perm))
                    } else if (message.channel.permissionsFor(message.author)
                        .serialize(false)[perm] == true) {
                        greatweGood = true;
                        greatPerms.push(await this.client.utils.convertReadable(perm))
                    }
                }
                if (trashPerms.length > 0) greatweGood = false;
                if (reallyneededPerms.length > 0) greatweGood = false;
                if (trashPerms.length > 0) console.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${trashPerms.join("\n")}`)
                if (reallyneededPerms.length > 0) return message.reply(`It seems you do not does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure you have these permissions:\n \`\`\`diff\n- ${reallyneededPerms.join("\n- ")}\n\`\`\``)
                    .catch(err => {
                        return;
                    })

                if (!greatweGood && trashPerms.length > 0) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`)
                    .catch(err => {
                        return;
                    })
            }
            var goodToGo = false;
            const neededPerms = [];
            const goodPerms = [];
            const badPerms = [];
            if (cmd.imgCmd) !cmd.botPerms ? cmd.botPerms = ["ATTACH_FILES"] : cmd.botPerms.push("ATTACH_FILES")
            if (cmd.botPerms && cmd.botPerms[0] && message.guild) { // Bot permission checking...
                for (const perm of cmd.botPerms) {

                    if (message.channel.permissionsFor(message.guild.me)
                        .serialize(false)[perm] === undefined) {
                        badPerms.push(perm)
                        goodToGo = false;
                    }

                    if (message.channel.permissionsFor(message.guild.me)
                        .serialize(false)[perm] == false) {
                        goodToGo = false;
                        neededPerms.push(await this.client.utils.convertReadable(perm))
                    } else {
                        goodToGo = true;
                        goodPerms.push(await this.client.utils.convertReadable(perm))
                    }
                }
                if (badPerms.length > 0) goodToGo = false;
                if (neededPerms.length > 0) goodToGo = false;
                if (badPerms.length > 0) console.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${badPerms.join("\n")}`)
                if (neededPerms.length > 0) return message.reply(`It seems ${this.client.user.tag} does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure it has these permissions:\n \`\`\`diff\n- ${neededPerms.join("\n- ")}\n\`\`\``)
                    .catch(() => null);

                if (!goodToGo && badPerms.length > 0) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`)
                    .catch(() => null);
            }
            if (cmd.nsfwOnly) {
                const nsfwPrompt = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        this.client.user.username + "'s Safety System",
                        message.author.avatarURL()
                    )
                    .setDescription(
                        `The command \`${cmd.name}\` can only be ran in NSFW channels.`
                    )
                    .setTimestamp();
                if (message.channel.nsfw == false)
                    return message.reply(
                            `${message.author.toString()}, oh no, this command is exclusive to NSFW channels. ${message.channel.permissionsFor(message.member).serialize(false).USE_EXTERNAL_EMOJIS
                     ? "<:sa_smirk:775582286556692491>"
                     : ";)"}`,
                            nsfwPrompt
                        )
                        .catch(() => null);
            }
            if (cmd.guildOnly) {
                const guildOnly = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                        `The \`${cmd.name}\` command can only be ran in guilds.`
                    );
                if (!message.guild)
                    return message.reply(`${message.author.toString()},`, guildOnly)
                        .catch(
                            () => null
                        );
            }
            if (cmd.specialGuilds && !message.guild || cmd.specialGuilds && !cmd.specialGuilds.includes(message.guild.id))
                return;
            const time = Date.now();
            if (cmd.persist) {
                var cooldown = await this.client.getCooldown(cmd.name, message.author.id, time)
                if (cooldown && cooldown.duration < time) {
                    let purge = this.client.db2.prepare(`DELETE FROM "cooldowns" WHERE (userid = '${message.author.id}' AND command = '${cmd.name}' AND duration < "${time}")`);
                    purge.run()
                    cooldown = undefined;
                } else if (cooldown && cooldown.duration > time) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for the ``' + cmd.name + '`` command. Please wait **' + humanizeDuration(cooldown.duration - time, {
                        round: true
                    }) + '** before trying to run this command again.')
                    .then(msg => msg.delete({
                            timeout: 2500
                        })
                        .catch(() => null))
            } else {
                const cooldown = this.client.cooldowns.get(`${cmd.name}-${message.author.id}`)
                if (cooldown <= time) this.client.cooldowns.delete(`${cmd.name}-${message.author.id}`)
                if (cooldown >= time) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for the ``' + cmd.name + '`` command. Please wait **' + humanizeDuration(cooldown - time, {
                        round: true
                    }) + '** before trying to run this command again.')
                    .then(msg => msg.delete({
                            timeout: 2500
                        })
                        .catch(() => null))
            }
            await cmd.execute(message, args, this.client, flags, parsedArgs)
                .catch(e => {
                    throw e || new Error(`Unknown error`)
                });
            if (!cmd.ownerOnly) this.client.statcord.postCommand(cmd.name, message.author.id); // Post command stats to statcord
            let insertdata = this.client.db2.prepare(`INSERT INTO "stats" VALUES(?,?)`);
            insertdata.run(cmd.name, new Date()
                .getTime()) // Save the statistics, basic stuff...
        } catch (error) {
            logger.error(`❌ | There was an error while running the command ${command} (${cmd?.filepath || 'Unknown filepath'}).\nUser: ${message.author.tag} (${message.author.id})\nRan in ${message.guild || 'DMs'}\nArguments: ${args.join(", ")}\n${message.guild ? `(${message.guild.id})` : ''}`)
            logger.error(error);
            message.channel.stopTyping(true, {
                force: true
            });
            return message.reply(
                    `there was an error trying to execute that command!\n${this.client.botAdmins.includes(message.author.id)
               ? `Please check the console for further details.`
               : `If this error persistents, contact the developers of this bot.`}`
                )
                .catch(() => null);
        }
    }
    /**
     * Register commands from a folder
     * @param {string} dir - The directory to register commands from.
     */
    async registerRegexes(dir = this.regexDir) {
        const regexFiles = await fs.readdir(path.join(process.cwd(), dir));
        for (const file of regexFiles) {
            let stat = await fs.lstat(path.join(process.cwd(), dir, file));
            if (stat.isDirectory())
                // If file is a directory, recursive call recurDir
                this.registerRegexes(path.join(dir, file));
            else {
                if (file.endsWith(".js")) {
                    try {
                        const regex = require(path.join(process.cwd(), dir, file));
                        if (!regex) {
                            logger.error(
                                `${file} does not seem to export anything. Ignoring the Regex.`
                            );
                            continue;
                        }
                        regex.filepath = path.join(process.cwd(), dir, file);
                        this.client.regexes.set(regex.name, regex);
                    } catch (e) {
                        logger.error(`❌ | There was an error loading Regex ${file}:\n`, e);
                    }
                }
            }
        }
    }
    /**
     * Register commands from a folder
     * @param {string} dir - The directory to register commands from.
     */
    async registerCommands(dir = this.commandsDir) {
        const commandFiles = await fs.readdir(path.join(process.cwd(), dir));
        for (const file of commandFiles) {
            let stat = await fs.lstat(path.join(process.cwd(), dir, file));
            if (stat.isDirectory())
                // If file is a directory, recursive call recurDir
                this.registerCommands(path.join(dir, file));
            else {
                if (file.endsWith(".js")) {
                    try {
                        const command = require(path.join(process.cwd(), dir, file));
                        if (!command) {
                            logger.error(
                                `${file} does not seem to export anything. Ignoring the command.`
                            );
                            continue;
                        }
                        if (!command.name) {
                            logger.error(
                                `${file} does not export a name. Ignoring the command.`);
                            continue;
                        }
                        if (command.category)
                            command.category = command.category.toLowerCase();
                        if (!command.category && path.basename(dir)
                            .toLowerCase() !== "commands")
                            command.category = path.basename(dir)
                            .toLowerCase();
                        if (command.category == "owner")
                            command.ownerOnly = true;
                        if (command.execute.constructor.name !== "AsyncFunction") {
                            logger.error(colors.bold(colors.yellow(`[DEVELOPER ERROR] ${file}'s executor is not an async function, this may lead to errors when trying to gracefully deal with errors. Not loading ${file}, however, it may be loaded manually. `)))
                            continue;
                        }
                        command.filepath = path.join(process.cwd(), dir, file);
                        this.client.commands.set(command.name, command);
                        for (const alias of command.aliases || []) {
                            this.client.aliases.set(alias, command);
                        }

                    } catch (e) {
                        logger.error(`❌ | There was an error loading command ${file}:\n`, e);
                    }
                }
            }
        }
    }
    /**
     * Register events from a folder.
     * @param {string} dir - The directory to register events from.
     */
    async registerEvents(dir = this.eventsDir) {
        let files = await fs.readdir(path.join(process.cwd(), dir));
        // Loop through each file.
        for (let file of files) {
            let stat = await fs.lstat(path.join(process.cwd(), dir, file));
            if (stat.isDirectory())
                // If file is a directory, recursive call recurDir
                this.registerEvents(path.join(dir, file));
            else {
                // Check if file is a .js file.
                if (file.endsWith(".js")) {
                    let eventName = file.substring(0, file.indexOf(".js"));
                    try {
                        let eventModule = require(path.join(process.cwd(), dir, file));
                        if (!eventModule) {
                            logger.error(
                                `${file} does not seem to export anything. Ignoring the event.`
                            );
                            continue;
                        }
                        if (typeof eventModule !== "function") {
                            logger.error(
                                `Expected a function for the event handler... Got ${typeof eventModule}.`
                            );
                            continue;
                        }
                        eventModule.filepath = dir;
                        logger.log(`📂 ${dir} | ${eventName} event loaded!`);
                        this.client.on(eventName, eventModule.bind(null, this.client));
                    } catch (err) {
                        logger.error(`❌ | There was an error loading event ${file}!`);
                        logger.error(err);
                    }
                }
            }
        }
    }
    /**
     * Parse flags from  a array.
     * @param {Array} args - The arguments to parse from.
     * @returns {object} - The parsed flags & the new arguments.
     */
    parseFlags(args) {
        const flags = {};
        for (var arg of args) {
            if (arg.startsWith("--")) {
                let flag = arg
                    .substr(2);
                let eq = flag.indexOf("=");
                if (eq != -1) {
                    flags[flag.substr(0, eq)
                        .toLowerCase()] = flag.substr(eq + 1);
                    delete args[args.indexOf(arg)];
                } else {
                    flags[flag.toLowerCase()] = true;
                    delete args[args.indexOf(arg)];
                }
            } else if (arg.startsWith("-") && arg.length > 2) {
                let flag = arg
                    .substr(1);
                let eq = flag.indexOf("=");
                if (eq != -1) {
                    flags[flag.substr(0, eq)
                        .toLowerCase()] = flag.substr(eq + 1);
                    delete args[args.indexOf(arg)];
                } else {
                    flags[flag.toLowerCase()] = true;
                    delete args[args.indexOf(arg)];
                }
            }
        }
        args = args.filter(function (el) {
            return el != null;
        });
        return {
            args: args,
            flags: flags
        };
    }
};

module.exports = CommandHandler;