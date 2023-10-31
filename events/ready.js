const Discord = require('discord.js');

function serialize(obj) {
    if (typeof obj !== "object") throw new TypeError(`Not the correct type. Got a ${typeof obj} instead of a objexct.`);
    for (const [key, value] of Object.entries(obj)) {
        if (obj[key] == "false") obj[key] = false;
        if (obj[key] == "true") obj[key] = true;
        if (obj[key] === 1) obj[key] = true;
        if (obj[key] === 0) obj[key] = false;
    }
    return obj;
}
const {
    version: djsversion
} = require('discord.js');
const fs = require('fs');
const axios = require("axios");
const figlet = require('figlet');
const colors = require('colors');
var AsciiTable = require('ascii-table');
const Humanize = require('humanize-plus')
const logger = require('../logger.js');
const system = require('system-commands');
const time = new Date()
const SentryAlphaClient = require('../SentryClient')
/** 
 * @param {SentryAlphaClient} client discord.js client
 */
module.exports = async client => {
    const {
        db,
        db2: statDb
    } = client;
    client.post = async function post(client) {
        await axios.post(`https://api.discordbots.co/v1/public/bot/${client.user.id}/stats`, {
                "serverCount": client.guilds.cache.size,
                "shardCount": 0
            }, {
                headers: {
                    'User-Agent': `${client.user.tag} Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['discordbots.co']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the discordbots.co API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.response}`)
            })
        await axios.post(`https://discord.boats/api/bot/${client.user.id}`, {
                "server_count": client.guilds.cache.size
            }, {
                headers: {
                    'User-Agent': `Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['discord.boats']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the discord.boats API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.message}`)
            })
        await axios.post(`https://discordbotlist.com/api/v1/bots/${client.user.id}/stats`, {
                guilds: client.guilds.cache.size,
                users: client.users.cache.size
            }, {
                headers: {
                    'User-Agent': `Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['discordbotlist.com']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the discordbotlist.com API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.message}`)
            })
        await axios.post(`https://botsfordiscord.com/api/bot/${client.user.id}`, {
                "server_count": client.guilds.cache.size
            }, {
                headers: {
                    'User-Agent': `Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['botsfordiscord.com']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the BotsForDiscord.com API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.message}`)
            })
        await axios.post(`https://api.discordlist.space/v2/bots/${client.user.id}`, {
                serverCount: client.guilds.cache.size
            }, {
                headers: {
                    "authorization": `${client.config.botLists['botlist.space']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the botlist.space API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response?.data?.message}`)
            })
        await axios.post(`https://bots.discordlabs.org/v2/bot/${client.user.id}/stats`, {
                "server_count": client.guilds.cache.size
            }, {
                headers: {
                    'User-Agent': `Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['dlabs']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the bots.discordlabs.org API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.message}`)
            })
        await axios.post(`https://top.gg/api/bots/${client.user.id}/stats`, {
                "server_count": client.guilds.cache.size,
                shard_count: 0
            }, {
                headers: {
                    'User-Agent': `Statistics/${client.package.version}`,
                    "Content-Type": "application/json",
                    "Authorization": `${client.config.botLists['top.gg']}`
                }
            })
            .catch(err => {
                logger.apiError(`Couldn't post to the top.gg API it returned the error:`)
                return logger.error(`Fatal Error at ${err.config.method.toUpperCase()} | ${err.config.url} with the status message of ${err.message}. The API returned this message: ${err.response.data.message}`)
            })
        return true;
    }
    await client.fetchApplication()
        .then(res => {
            client.application = res
            if (res.owner.constructor.name == 'Team') {
                client.botAdmins = [`${res.owner.ownerID}`]
                res.owner.members.filter(x => !client.botAdmins.includes(x.user.id))
                    .forEach(x => {
                        client.botAdmins.push(x.user.id)
                    })
            } else {
                client.botAdmins = []
                client.botAdmins.push(res.owner.user.id)
            }
        })
        .catch(err => {
            logger.apiError("Couldn't fetch Discord API info about the bot! Oh no!")
            logger.error(err)
        })

    client.votes = []
    //   await system(`rm ${process.env.pm_out_log_path}`).then(() => {
    //       logger.fs("Successfully deleted the log file from a previous session for privacy.")
    //   }).catch(error => {
    //       logger.fsError("There was a problem deleting the previous session's log file.\n" + error)
    //   })
    //   await system(`rm ${process.env.pm_err_log_path}`).then(() => {
    //       logger.fs("Successfully deleted the old error file from a previous session for privacy.")
    //   }).catch(error => {
    //       logger.fsError("There was a problem deleting the previous session's error logs file.\n" + error)
    //   })
    setInterval(async () => await client.post(client), 310000);
    setInterval(async () => client.votes = await client.getRecentVotes(), 57000)
    const votes = await client.getRecentVotes();
    client.votes = votes
    setInterval(function () {
        client.user.setPresence({
            status: 'dnd',
            activity: {
                name: client.status.name,
                type: client.status.type,
            }
        })
    }, 12000);
    client.package = require(`../package.json`)
    const botAdminUsers = `${client.botAdmins.map(x => `${client.users.cache.get(x).tag}`).join(" & ")}`
    client.maintenance = require(`../maintenance.json`)
    console.log(colors.brightBlue(figlet.textSync('Sentry-ALPHA', {
        horizontalLayout: 'full'
    })));
    if (client.commands.size === 0) {
        logger.error(colors.red(colors.bold("Sanity Check failed - did ANY commands load?!?! WTF!")))
        process.exit(212)
    }
    logger.log(colors.green('The bot has successfully started.'))
    const noTitle = new AsciiTable()
        .addRow(`Owners: ${botAdminUsers}`)
        .addRow(`Commands: ${client.commands.size} (${client.aliases.size} Aliased)`)
        .addRow(`Votes: ${client.votes.length}`)
        .addRow(`Prefix: ${client.config.prefix}`)
        .addRow(`Servers: ${client.guilds.cache.size}`)
        .addRow(`Users: ${client.users.cache.size}`)
        .addRow(`Node.js Version: ${process.version}`)
        .addRow(`Discord.js Version: ${djsversion}`)
        .addRow(`${client.user.tag} Version: ${client.package.version}`)
    console.log(colors.bold(noTitle.toString()))
    console.log(colors.underline(`Invite URL: https://sentry.best/invite`))
    await client.post(client)
    const channel = client.channels.cache.get('724104847342829661');

    client.guilds.cache.forEach(async (guild) => {
        var database = client.db.prepare(`SELECT * FROM "Guild Settings" WHERE guildID = ?`)
            .get(guild.id)
        if (!client.guildConfigs.has(guild.id) && database) client.guildConfigs.set(guild.id, database)
        if (!database) {
                let insertdata = db.prepare(`INSERT OR IGNORE INTO "Guild Settings" (guildID, remove_roles, admin, snipe, spellcheck) VALUES(?,?,?,?,?)`)
                insertdata.run(guild.id, 1, 0, 1, 1);
                var database = client.db.prepare(`SELECT * FROM "Guild Settings" WHERE guildID = ?`)
                    .get(guild.id)
                serialize(database);
                client.guildConfigs.set(guild.id, database)
        }
    })
    client.guilds.cache.forEach(async (guild) => {
        var database = client.db.prepare(`SELECT * FROM "Guild Channels" WHERE guildID = ?`)
            .get(guild.id)
        if (!client.guildConfigs.has(guild.id) && database) client.guildConfigs.set(guild.id, database)
        if (!database) {
                let insertdata = db.prepare(`INSERT OR IGNORE INTO "Guild Channels" (guildID) VALUES(?)`)
                insertdata.run(guild.id);
                var database = db.prepare(`SELECT * FROM "Guild Channels" WHERE guildID = ?`)
                    .get(guild.id)
                serialize(database)
                client.configChannels.set(guild.id, database)
        }
    })
    var schedule = require('node-schedule');
    client.package = require('../package.json');
    setInterval(async function () {
        var newGuilds = []
        client.guilds.cache.forEach(async (guild) => {
            var database = client.db.prepare(`SELECT * FROM Settings WHERE guildID = ?`)
                .get(guild.id);
            serialize(database)
            if (!client.guildSettings.has(guild.id) && database) client.guildSettings.set(guild.id, database)
            if (!database) {
                newGuilds.push(guild.id)
                const guildEmbed = new Discord.MessageEmbed()
                guildEmbed.setColor('RANDOM')
                guildEmbed.setTitle(guild.name)
                guildEmbed.setAuthor(client.users.cache.get(guild.ownerID)
                    .tag, client.users.cache.get(guild.ownerID)
                    .displayAvatarURL({
                        size: 4096,
                        dynamic: true,
                        format: "png"
                    }))
                guildEmbed.addField('Statistics', `Members: ${guild.members.cache.size}\nBots: ${guild.members.cache.filter(x => x.user.bot).size}\nChannels: ${guild.channels.cache.size}\nFeatures:\n \`\`- ${guild.features.join("\n- ")}\`\`\nCreated At: ${new Date(guild.createdTimestamp).toLocaleString()} EST\nEmojis: ${guild.emojis.cache.size}\nRoles: ${guild.roles.cache.size}`)
                guildEmbed.addField("Additional Information", `🌐 Region: ${guild.region.charAt(0).toUpperCase() + guild.region.slice(1)}\n Guild ID: ${guild.id}\nVerification Level: ${guild.verificationLevel.toLowerCase().charAt(0).toUpperCase() + guild.verificationLevel.toLowerCase().slice(1) }`)
                guildEmbed.addField("Boosting Information", `🌟 Tier ${guild.premiumTier} guild, currently has ${guild.premiumSubscriptionCount} boosts.`)
                guildEmbed.setThumbnail(`${guild.iconURL({dynamic: true, size: 4096, format: "png"})}`)
                if (guild.banner) guildEmbed.setImage(`${guild.bannerURL({dynamic: true, size: 4096, format: "png"})}`)
                guildEmbed.setTimestamp()
                guildEmbed.setFooter(`Level ${guild.premiumTier} Server`);
                var welcomeText = "New guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 99) welcomeText = "New large guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 499) welcomeText = "New ultra large guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 999) welcomeText = "New crazy large guild! <@387062216030945281> look at this!"
                channel.send("Joined a " + welcomeText + " This guild was joined while offline. " + ` \`\`${guild.name}\`\` is now apart of the ${client.guilds.cache.size} guilds ${client.user.tag } brings fun into.`, guildEmbed)
                    .catch(err => {
                        logger.error(`Couldn't alert the support server of changes!`, err)
                    })

                    let insertdata = db.prepare(`INSERT OR IGNORE INTO Settings VALUES(?,?,?,?)`)
                    insertdata.run(guild.id, guild.name, 0, client.config.prefix);
                    var database = client.db.prepare(`SELECT * FROM Settings WHERE guildID = ?`)
                        .get(guild.id)
                    serialize(database)
                    client.guildSettings.set(guild.id, database)
            }
        })
    }, 60000);
    setInterval(async function () {
        var newGuilds = []
        client.guilds.cache.forEach(async (guild) => {
            var database = client.db.prepare(`SELECT * FROM Settings WHERE guildID = ?`)
                .get(guild.id);

            if (database) serialize(database)
            if (!client.guildSettings.has(guild.id) && database) client.guildSettings.set(guild.id, database)
            if (!database) {
                newGuilds.push(guild.id)
                const guildEmbed = new Discord.MessageEmbed()
                guildEmbed.setColor('RANDOM')
                guildEmbed.setTitle(guild.name)
                guildEmbed.addField('Statistics', `Members: ${guild.members.cache.size}\nBots: ${guild.members.cache.filter(x => x.user.bot).size}\nChannels: ${guild.channels.cache.size}\nFeatures:\n \`\`- ${guild.features.join("\n- ")}\`\`\nCreated At: ${new Date(guild.createdTimestamp).toLocaleString()} EST\nEmojis: ${guild.emojis.cache.size}\nRoles: ${guild.roles.cache.size}`)
                guildEmbed.addField("Additional Information", `🌐 Region: ${guild.region.charAt(0).toUpperCase() + guild.region.slice(1)}\n Guild ID: ${guild.id}\nVerification Level: ${guild.verificationLevel.toLowerCase().charAt(0).toUpperCase() + guild.verificationLevel.toLowerCase().slice(1) }`)
                guildEmbed.addField("Boosting Information", `🌟 Tier ${guild.premiumTier} guild, currently has ${guild.premiumSubscriptionCount} boosts.`)
                guildEmbed.setThumbnail(`${guild.iconURL({dynamic: true, size: 4096, format: "png"})}`)
                if (guild.banner) guildEmbed.setImage(`${guild.bannerURL({dynamic: true, size: 4096, format: "png"})}`)
                guildEmbed.setTimestamp()
                guildEmbed.setFooter(`Level ${guild.premiumTier} Server`);
                var welcomeText = "New guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 99) welcomeText = "New large guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 499) welcomeText = "New ultra large guild!"
                if (guild.members.cache.filter(x => !x.user.bot)
                    .size > 999) welcomeText = "New crazy large guild! <@387062216030945281> look at this!"
                channel.send("Joined a " + welcomeText + " This guild was joined while offline. " + ` \`\`${guild.name}\`\` is now apart of the ${client.guilds.cache.size} guilds ${client.user.tag } brings fun into.`, guildEmbed)
                    .catch(err => {
                        logger.error(`Couldn't alert the support server of changes!`, err)
                    })
                    let insertdata = db.prepare(`INSERT OR IGNORE INTO Settings (guildID, guildName, premium, prefix) VALUES(?,?,?,?)`)
                    insertdata.run(guild.id, guild.name, 0, client.config.prefix);
                    var database = client.db.prepare(`SELECT * FROM Settings WHERE guildID = ?`)
                        .get(guild.id)
                    serialize(database)
                    client.guildSettings.set(guild.id, database)
            }
        })
    }, 10000);
    setInterval(function () {
        client.guilds.cache.forEach(async (guild) => {
            var database = client.db.prepare(`SELECT * FROM "Guild Settings" WHERE guildID = ?`)
                .get(guild.id)
            if (!client.guildConfigs.has(guild.id) && database) client.guildConfigs.set(guild.id, serialize(database))
            if (!database) {
                    let insertdata = db.prepare(`INSERT OR IGNORE INTO "Guild Settings" (guildID, remove_roles, admin, snipe, spellcheck) VALUES(?,?,?,?,?)`)
                    insertdata.run(guild.id, true, false, true, true);
                    var database = client.db.prepare(`SELECT * FROM "Guild Settings" WHERE guildID = ?`)
                        .get(guild.id)
                    if (database) serialize(database)
                    client.guildConfigs.set(guild.id, database)
            }
        })
    }, 10000);
    setInterval(function () {
        client.guilds.cache.forEach(async (guild) => {
            var database = client.db.prepare(`SELECT * FROM "Guild Channels" WHERE guildID = ?`)
                .get(guild.id);
            if (!client.guildConfigs.has(guild.id) && database) client.guildConfigs.set(guild.id, serialize(database))
            if (!database) {
                    let insertdata = db.prepare(`INSERT OR IGNORE INTO "Guild Channels" (guildID) VALUES(?)`)
                    insertdata.run(guild.id);
                    var database = client.db.prepare(`SELECT * FROM "Guild Channels" WHERE guildID = ?`)
                        .get(guild.id);
                    serialize(database)
                    client.configChannels.set(guild.id, database)
            }
        })
    }, 10000)
    var rule = new schedule.RecurrenceRule();
    rule.minute = 54;

    var j = schedule.scheduleJob(rule, function () {
        fs.copyFile('database.db', 'backup.db', (err) => {
            if (err) throw err;
        });
        const backups = client.channels.cache.get('724104847342829661')
        const backupTime = new Date()
            .toLocaleTimeString();
        backups.send(`Hourly backup files. ${backupTime}`, {
                files: [
              "./backup.db",
              "./data.db"
          ]
            })
            .catch(err => {
                logger.error(`ERROR HAS OCCURED WITH SENDING BACKUP! WEEWOO!`)
            });
    });
};