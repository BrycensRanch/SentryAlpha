const {
    statcord
} = require(`../../index`);
const Discord = require('discord.js');
const humanizeDuration = require(`humanize-duration`);
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const jsdiscordperms = require("jsdiscordperms");
var stringSimilarity = require('string-similarity');
module.exports = async(client, oldMessage, message) => {
    const {db2, logger} = client;
    if (message.author.bot == true) return;
    if (message.type !== "DEFAULT") return;
    client.editsnipes.set(message.id, {
        content: oldMessage.content,
        author: oldMessage.author,
        channel: oldMessage.channel.id,
        image: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
        timestamp: message.editedTimestamp,
        id: message.id,
        reference: oldMessage.reference,
        attachments: oldMessage.attachments.map(x => `[${x.name}](${x.width ? x.proxyURL : x.url})`)
    });
    setTimeout(function() {
        client.editsnipes.delete(message.id);
    }, 600000);
    if (message.guild && !message.channel.permissionsFor(message.guild.me).serialize(false).SEND_MESSAGES) return; // If the bot can't send messages to the channel, ignore.
    var botPrefix = client.config.prefix;
    if (message.guild) var guildInfo = client.guildSettings.get(message.guild.id); // guildSettings: {"guildID":"638036514214772737","guildName":"Vultrex Development","premium":false,"prefix":"sa!"}
    if (guildInfo) botPrefix = guildInfo.prefixc;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(botPrefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const Rawargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const parsedArgs = client.utils.parse(Rawargs.join(" ")).filter(arg => arg !== Rawargs[0]);
    var flags = {};
    for (var arg of parsedArgs) {
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
    const command = args.shift().toLowerCase();
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
                                .setDescription(`Possible matches for your mispelled command.\nI have found ${goodMatches.length} possible matche(s) for your misspell.\n\n**${goodMatches.join(",\n")}**\n\nIf you'd like this disable this feature, do ${botPrefix}config SpellCheck OFF`)
                                .setTimestamp()
                                .setFooter(`Not the best with spelling? It's okay. :)`);
                            return message.reply(`Did you mean the command \`${matches.bestMatch.target}\`?`, SpellCheck).then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
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
                    return message.reply(NoPermsEmbed).then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
                }
                if (cmd.imgCmd) !cmd.botPerms ? cmd.botPerms = ["ATTACH_FILES"] : cmd.botPerms.push("ATTACH_FILES")
                var greatweGood = false;
                const reallyneededPerms = [];
                const greatPerms = [];
                const trashPerms = [];
                if (message.guild && cmd.userPerms) { // PERMISSION CHECKING IF THERE IS A GUILD
                    for (const perm of cmd.userPerms) {

                        if (message.channel.permissionsFor(message.member).serialize(false)[perm] === undefined) {
                            trashPerms.push(perm)
                            greatweGood = false;
                        }

                        if (message.channel.permissionsFor(message.member).serialize(false)[perm] == false) {
                            greatweGood = false;
                            reallyneededPerms.push(await jsdiscordperms.convertReadable(perm))
                        } else {
                            greatweGood = true;
                            greatPerms.push(await jsdiscordperms.convertReadable(perm))
                        }
                    }
                    if (trashPerms.length > 0) greatweGood = false;
                    if (reallyneededPerms.length > 0) greatweGood = false;
                    if (trashPerms.length > 0) logger.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${trashPerms.join("\n")}`)
                    if (reallyneededPerms.length > 0 && !flags.bypass & client.botAdmins.includes(message.author.id)) return message.reply(`It seems you do not does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure you have these permissions:\n \`\`\`diff\n- ${reallyneededPerms.join("\n- ")}\n\`\`\``).catch(err => {
                        return;
                    })

                    if (!greatweGood && trashPerms.length > 0 && !flags.bypass & client.botAdmins.includes(message.author.id)) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`).catch(err => {
                        return;
                    })
                }
                var goodToGo = false;
                const neededPerms = [];
                const goodPerms = [];
                const badPerms = [];
                if (!cmd.botPerms) cmd.botPerms = ["EMBED_LINKS"]
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
                    if (badPerms.length > 0) goodToGo = false;
                    if (neededPerms.length > 0) goodToGo = false;
                    if (badPerms.length > 0) logger.warn(`The command ${cmd.name} provides an non-existent bot permission for Discord.js. Here is the permissions that are invalid:\n ${badPerms.join("\n")}`)
                    if (neededPerms.length > 0) return message.reply(`It seems ${client.user.tag} does not have the required permissions to run the \`\`${cmd.name}\`\` command.\nMake sure it has these permissions:\n \`\`\`diff\n- ${neededPerms.join("\n- ")}\n\`\`\``).then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);

                    if (!goodToGo && badPerms.length > 0) return message.reply(`It seems there was a error regarding permissions for the command \`\`${cmd.name}\`\` command.\nDon't worry, I've already alerted the developer team of this issue. Please try again later.`).then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
                }
                if (cmd.nsfwOnly) {
                    const nsfwPrompt = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setAuthor(client.user.username + "'s Safety System", message.author.avatarURL())
                        .setDescription(`The command \`${cmd.name}\` can only be ran in NSFW channels.`)
                        .setTimestamp()
                    if (message.channel.nsfw == false && !flags.bypass & client.botAdmins.includes(message.author.id)) return message.reply(`${message.author.toString()}, oh no, this command is exclusive to NSFW channels. ${message.channel.permissionsFor(message.member).serialize(false).USE_EXTERNAL_EMOJIS ? "<:sa_smirk:775582286556692491>" : ";)"}`, nsfwPrompt).then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
                }
                if (cmd.guildOnly) {
                    const guildOnly = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setDescription(`The \`${cmd.name}\` command can only be ran in guilds.`)
                    if (!message.guild && !flags.bypass & client.botAdmins.includes(message.author.id)) return message.reply(`${message.author.toString()},`, guildOnly).catch(() => null);
                }
                if (cmd.specialGuilds && !message.guild) return;
                const time = Date.now();
                if (cmd.economyCmd) {
                    let cooldownCheck = db2.prepare(`SELECT * FROM "cooldowns" WHERE (userid = '${message.author.id}' AND command = '${cmd.name}' AND duration < "${time}")`)
                    var cooldown = cooldownCheck.get()
                        if (cooldown) logger.log(time - cooldown.duration)
                        if (cooldown && cooldown.duration < time) {
                            let purge = db2.prepare(`DELETE FROM "cooldowns" WHERE (userid = '${message.author.id}' AND command = '${cmd.name}' AND duration < "${time}")`);
                            purge.run()
                            cooldown = undefined
                        } else if (cooldown && cooldown.duration > time) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for ``' + cmd.name + '``. Please wait **' + humanizeDuration(cooldown.duration - time, {
                            round: true
                        }) + '** before trying to run this command again.').then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
                } else {
                    const cooldown = client.cooldowns.get(`${cmd.name}-${message.author.id}`)
                    if (cooldown <= Date.now()) client.cooldowns.delete(`${cmd.name}-${message.author.id}`)
                    if (cooldown && cooldown > Date.now()) return message.reply(cmd.coolDownMsg || 'You are currently on cooldown for ``' + cmd.name + '``. Please wait **' + humanizeDuration(cooldown - time, {
                        round: true
                    }) + '** before trying to run this command again.').then(msg => msg.delete({timeout: 2500}).catch(() => null)).catch(() => null);
                }
                if (client.prompts.has(message.id)) {
                        message.channel.send = 
                        async function edit(args) {
                            const msg = await message.channel.messages.fetch(client.prompts.get(message.id)).catch(() => null);
                            if (msg) return await msg.edit(args).then(newMsg => {return newMsg})
                            else return await message.channel.send(args).then(msg => client.prompts.set(message.id, msg.id))
                        }
                }
                cmd.execute(message, args, client, flags, parsedArgs) // Run the command
                    .catch(err => { // Any errors? Log it and display em!
                        logger.error(err);
                        message.reply(`${message.author.toString()}, there was an error trying to execute that command! ${client.botAdmins.includes(message.author.id) ? `Please check the console for further details.` : `If this error persistents, contact our support team which can be found on the \`\`${botPrefix}invite\`\` command.`}`).catch(() => null);
                    })
                if (!cmd.cooldownHandle && cmd.economyCmd) { // If there is no cooldown handler for who's gonna input the cooldown, just do it ourselves.
                    let addCooldown = db2.prepare(`INSERT INTO "cooldowns" VALUES(?,?,?)`);
                    addCooldown.run(`${cmd.name}`, `${cmd.cooldown ? cmd.cooldown * 1000 +time : 2 * 1000 +time}`, `${message.author.id}`);
                } else {
                    client.cooldowns.set(`${cmd.name}-${message.author.id}`, `${cmd.cooldown ? cmd.cooldown * 1000 +Date.now() : 2 * 1000 +Date.now()}`)
                }
                if (!cmd.ownerOnly) statcord?.postCommand(cmd.name, message.author.id); // Post command stats to statcord...
                let insertdata = db2.prepare(`INSERT INTO "stats" VALUES(?,?)`);
                insertdata.run(cmd.name, new Date().getTime()) // Save the statistics, basic stuff...

            }
        } catch (error) {
            logger.error(error);
            message.channel.stopTyping(true)
            message.reply(`${message.author.toString()}, there was an error trying to execute that command! ${client.botAdmins.includes(message.author.id) ? `Please check the console for further details.` : `If this error persistents, contact our support team which can be found on the \`\`${botPrefix}invite\`\` command.`}`).catch(() => null);
        }
    }
};