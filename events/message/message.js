const Discord = require('discord.js');
const humanizeDuration = require(`humanize-duration`);
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const jsdiscordperms = require("jsdiscordperms");
var stringSimilarity = require('string-similarity');
module.exports = async (client, message) => {
    const {
        db2
    } = client;
    if (message.author.bot == true) return;
    if (message.guild && !message.channel.permissionsFor(message.guild.me).serialize(false).SEND_MESSAGES) return; // If the bot can't send messages to the channel, ignore.
    var botPrefix = client.config.prefix;
    if (message.guild) var guildInfo = client.guildSettings.get(message.guild.id); // guildSettings: {"guildID":"638036514214772737","guildName":"Vultrex Development","premium":false,"prefix":"sa!"}
    if (guildInfo) botPrefix = guildInfo.prefix;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(botPrefix)}|${client.user.username},)\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const Rawargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const parsedArgsRaw = client.utils.parse(Rawargs.join(" "));
    var flags = {};
    for (var arg of parsedArgsRaw) {
        if (arg.startsWith('--')) {
            let flag = arg.toLowerCase().substr(2);
            let eq = flag.indexOf('=');
            if (eq != -1) {
                flags[flag.substr(0, eq)] = flag.substr(eq + 1);
                delete Rawargs[Rawargs.indexOf(arg)];
            } else {
                flags[flag] = true;
                delete Rawargs[Rawargs.indexOf(arg)];
            }
        } else if (arg.startsWith('-') && arg.length > 2) {
            let flag = arg.toLowerCase().substr(1);
            let eq = flag.indexOf('=');
            if (eq != -1) {
                flags[flag.substr(0, eq)] = flag.substr(eq + 1);
                delete Rawargs[Rawargs.indexOf(arg)];
            } else {
                flags[flag] = true;
                delete Rawargs[Rawargs.indexOf(arg)];
            }
        }
    };
    const args = Rawargs.filter(function(el) {
        return el != null;
    });
    if (flags.bypass && !client.botAdmins.includes(message.author.id)) flags.bypass = null
    const command = args.shift().toLowerCase();
    const parsedArgs = client.utils.parse(Rawargs.join(" ").slice(command.length));
    const blacklistEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor(`${client.user.username} Blacklist`, message.author.avatarURL())
        .setDescription(`It seems as you have been blacklisted from ${client.user.username}! If you believe this is a mistake, join our [support server](https://discord.gg/Yx755gU) to get this cleared up. `)
        .setTimestamp()
        .setFooter(`You're officially... CANCELLED!`);
    let cmd;
    if (prefixRegex.test(message.content)) {
        try {
            if (client.commands.has(command)) {
                cmd = client.commands.get(command)
            } else {
                if (!client.aliases.has(command)) {
                    if (message.guild) {
                        let guildSetting = client.guildConfigs.get(message.guild.id)
                        if (guildSetting && guildSetting.spellcheck) {
                            var matches = stringSimilarity.findBestMatch(`${command}`, client.commands.map(x => x.name));
                            if (matches.bestMatch.rating < 0.6) return;
                            const goodMatches = []
                            matches.ratings.forEach((match) => {
                                if (match.rating < 0.6) return
                                goodMatches.push(match.target)
                            })
                            const SpellCheck = new Discord.MessageEmbed() // Spell check for possibly misspelled commands for guilds only for now..
                                .setColor('RANDOM')
                                .setAuthor(`${client.user.username} Spell Check`, message.author.avatarURL())
                                .setDescription(`Possible matches for your mispelled command.\nI have found ${goodMatches.length} possible matche(s) for your misspell.\n\n**${goodMatches.join(",\n")}**\n\nIf you'd like this **disable this feature**, do ${botPrefix}config SpellCheck OFF`)
                                .setTimestamp()
                                .setFooter(`Not the best with spelling? It's okay. :)`);
                            return message.reply(`Did you mean the command \`${matches.bestMatch.target}\`?`, SpellCheck).catch(() => null);
                        }
                    }
                }
                cmd = client.aliases.get(command)
            }
            if (cmd && client.blacklist.has(message.author.id)) return message.reply(blacklistEmbed).catch(() => null);
            if (cmd) {
                if (cmd.ownerOnly && !client.botAdmins.includes(message.author.id)) { // OWNER ONLY COMMAND DETECTED, GIVE THEM A PROMPT SAYING THEY DONT HAVE PERMS.
                    const NoPermsEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setAuthor(`This command is for epic gaymers only.`, message.author.avatarURL())
                        .setDescription(`It seems like you've come across a secret command! Sadly, you do not have the permission to run this command. Please try again later!  If you believe this is a mistake, join our [support server](https://discord.gg/Yx755gU) to get this cleared up. `)
                        .setTimestamp()
                        .setFooter(`ACCESS DENIED // DO NOT COME BACK!`);
                    return message.reply(NoPermsEmbed).catch(() => null);
                }
                if (cmd.imgCmd) !cmd.botPerms ? cmd.botPerms = ["ATTACH_FILES"] : cmd.botPerms.push("ATTACH_FILES")
                var greatweGood = false;
                const reallyneededPerms = [];
                const greatPerms = [];
                const trashPerms = [];
                if (message.guild && cmd.userPerms && !flags.bypass) { // PERMISSION CHECKING IF THERE IS A GUILD
                    for (const perm of cmd.userPerms) {
                        logger.log(`Permission check for ${cmd.name} | ${perm}`)

                        if (message.channel.permissionsFor(message.author).serialize(false)[perm] === undefined) {
                            trashPerms.push(perm)
                            greatweGood = false;
                        }

                        if (message.channel.permissionsFor(message.author).serialize(false)[perm] == false) {
                            greatweGood = false;
                            reallyneededPerms.push(await jsdiscordperms.convertReadable(perm))
                        } else if (message.channel.permissionsFor(message.author).serialize(false)[perm] == true){
                            greatweGood = true;
                            logger.log(jsdiscordperms.permissions)
                            greatPerms.push(await jsdiscordperms.convertReadable(perm))
                        }
                    }
                    if (trashPerms.length > 0) greatweGood = false;
                    if (reallyneededPerms.length > 0) greatweGood = false;
                    if (trashPerms.length > 0) console.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${trashPerms.join("\n")}`)
                    if (reallyneededPerms.length > 0 ) return message.reply(`It seems you do not does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure you have these permissions:\n \`\`\`diff\n- ${reallyneededPerms.join("\n- ")}\n\`\`\``).catch(err => {
                        return;
                    })

                    if (!greatweGood && trashPerms.length > 0 ) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`).catch(err => {
                        return;
                    })
                }
                var goodToGo = false;
                const neededPerms = [];
                const goodPerms = [];
                const badPerms = [];
                if (cmd.botPerms && message.guild) { // Bot permission checking...
                    for (const perm of cmd.botPerms) {

                        if (message.channel.permissionsFor(message.guild.me).serialize(false)[perm] === undefined) {
                            badPerms.push(perm)
                            goodToGo = false;
                        }

                        if (message.channel.permissionsFor(message.guild.me).serialize(false)[perm] == false) {
                            goodToGo = false;
                            neededPerms.push(await jsdiscordperms.convertReadable(perm))
                        } else {
                            goodToGo = true;
                            goodPerms.push(await jsdiscordperms.convertReadable(perm))
                        }
                    }
                    if (badPerms.length > 0 ) goodToGo = false;
                    if (neededPerms.length > 0 ) goodToGo = false;
                    if (badPerms.length > 0 ) console.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${badPerms.join("\n")}`)
                    if (neededPerms.length > 0 ) return message.reply(`It seems ${client.user.tag} does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure it has these permissions:\n \`\`\`diff\n- ${neededPerms.join("\n- ")}\n\`\`\``).catch(() => null);

                    if (!goodToGo && badPerms.length > 0 ) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`).catch(() => null);
                }
                if (cmd.nsfwOnly) {
                    const nsfwPrompt = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setAuthor(client.user.username + "'s Safety System", message.author.avatarURL())
                        .setDescription(`The command \`${cmd.name}\` can only be ran in NSFW channels.`)
                        .setTimestamp()
                    if (message.channel.nsfw == false ) return message.reply(`${message.author.toString()}, oh no, this command is exclusive to NSFW channels. ${message.channel.permissionsFor(message.member).serialize(false).USE_EXTERNAL_EMOJIS ? "<:sa_smirk:775582286556692491>" : ";)"}`, nsfwPrompt).catch(() => null);
                }
                if (cmd.guildOnly) {
                    const guildOnly = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setDescription(`The \`${cmd.name}\` command can only be ran in guilds.`)
                    if (!message.guild ) return message.reply(`${message.author.toString()},`, guildOnly).catch(() => null);
                }
                if (cmd.specialGuilds && !message.guild) return;
                else if (cmd.specialGuilds && !cmd.specialGuilds.includes(message.guild.id)) return;
                const time = Date.now();
                if (cmd.persist) {
                    var cooldown = await client.getCooldown(cmd.name, message.author.id, time)
                    if (cooldown && cooldown.duration < time) {
                        let purge = db2.prepare(`DELETE FROM "cooldowns" WHERE (userid = '${message.author.id}' AND command = '${cmd.name}' AND duration < "${time}")`);
                        purge.run()
                        cooldown = undefined;
                    } else if (cooldown && cooldown.duration > time) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for the ``' + cmd.name + '`` command. Please wait **' + humanizeDuration(cooldown.duration - time, {
                        round: true
                    }) + '** before trying to run this command again.').then(msg => msg.delete({timeout: 12500}).catch(() => null))
                } else {
                    const cooldown = client.cooldowns.get(`${cmd.name}-${message.author.id}`)
                    if (cooldown <= Date.now()) client.cooldowns.delete(`${cmd.name}-${message.author.id}`)
                    if (cooldown >= Date.now()) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for the ``' + cmd.name + '`` command. Please wait **' + humanizeDuration(cooldown - time, {
                        round: true
                    }) + '** before trying to run this command again.').then(msg => msg.delete({timeout: 12500}).catch(() => null))
                }
                message.channel.send = async function (content, options) {
                
                    if (this instanceof Discord.User || this instanceof Discord.GuildMember) {
                      return this.createDM().then(dm => dm.send(content, options));
                    }
                
                    let apiMessage;
                
                    if (content instanceof Discord.APIMessage) {
                      apiMessage = content.resolveData();
                    } else {
                      apiMessage = Discord.APIMessage.create(this, content, options).resolveData();
                      if (Array.isArray(apiMessage.data.content)) {
                        return Promise.all(apiMessage.split().map(this.send.bind(this)));
                      }
                    }
                
                    const { data, files } = await apiMessage.resolveFiles();
                    return client.api.channels[this.id].messages
                      .post({ data, files })
                      .then(d => {const msg = client.actions.MessageCreate.handle(d).message
                        client.prompts.set(message.id, msg.id)
                    return msg;
                    });
                }
                cmd.execute(message, args, client, flags, parsedArgs) // Run the command
                    .catch(err => { // Any errors? Log it and display em!
                        logger.error(err);
                        const errorID = "DISCORD.JS-"+client.utils.cryptoRandomString(25)
                        client.error.set(errorID, err)
                        return message.reply(`${message.author.toString()}, there was an error trying to execute that command!\nError ID: \`${errorID}\`\n${client.botAdmins.includes(message.author.id) ? `Please check the console for further details.` : `If this error persistents, contact our support team which can be found on the \`\`${botPrefix}invite\`\` command.`}`).catch(() => null);
                    })
                if (cmd.cooldown && cmd.persist) { // If there is no cooldown handler for who's gonna input the cooldown, just do it ourselves.
                    let addCooldown = db2.prepare(`INSERT INTO "cooldowns" VALUES(?,?,?)`);
                    addCooldown.run(`${cmd.name}`, `${cmd.cooldown ? cmd.cooldown * 1000 +time : 2 * 1000 +time}`, `${message.author.id}`);
                } else if (cmd.cooldown) {
                    client.cooldowns.set(`${cmd.name}-${message.author.id}`, `${cmd.cooldown * 1000 +Date.now()}`) // Add it to the cooldown cache.
                }
                if (!cmd.ownerOnly) client.statcord.postCommand(cmd.name, message.author.id); // Post command stats to statcord...
                let insertdata = db2.prepare(`INSERT INTO "stats" VALUES(?,?)`);
                insertdata.run(cmd.name, new Date().getTime()) // Save the statistics, basic stuff...
            }
        } catch (error) {
            logger.error(error);
            const errorID = "DISCORD.JS-"+client.utils.cryptoRandomString(25)
            client.error.set(errorID, error)
            message.channel.stopTyping(true)
            return message.reply(`${message.author.toString()}, there was an error trying to execute that command!\nError ID: \`${errorID}\`\n${client.botAdmins.includes(message.author.id) ? `Please check the console for further details.` : `If this error persistents, contact our support team which can be found on the \`\`${botPrefix}invite\`\` command.`}`).catch(() => null);
        }
    }
};