const Discord = require('discord.js');
const SentryClient = require('./SentryClient');
const fs = require('fs');
const figlet = require('figlet');
const Statcord = require("statcord.js");
const fastify = require("fastify")
const client = new SentryClient({
    intents: Discord.Intents.PRIVILEGED,
    allowedMentions: {
        repliedUser: false
    },
    presence: {
        status: 'dnd',
        activity: {
            name: `${require("./config.json").prefix || "s!"}help | sentry.best`,
            type: "WATCHING",
        }
    }
});
const {
    prefix,
    token,
    ownerID,
    apiKey,
    botLists
} = client.config;
const {
    statcordToken
} = botLists;
const logs = require('discord-logs');
global.fetch = require("node-fetch");
const {
    APIMessage,
    Message
} = require('discord.js');
/**
 * @param {string} [options?.messageID] - the message id that will be quoted
 * @param {boolean} [options?.mention] - whether the client should mention the author
 */
Message.prototype.reply = async function (content, options) {
    const message_reference = {
        message_id: (
            !!content && !options ?
            typeof content === 'object' && content.messageID :
            options && options.messageID
        ) || this.id,
        message_channel: this.channel.id
    }

    const allowed_mentions = {
        parse: ['users', 'roles', 'everyone'],
        replied_user: typeof content === 'object' ? content && +content.mention : options && +options.mention
    }

    const {
        data: parsed,
        files
    } = await APIMessage
        .create(this, content, options)
        .resolveData()
        .resolveFiles()

    return this.client.api.channels[this.channel.id].messages
        .post({
            data: {
                ...parsed,
                message_reference,
                allowed_mentions
            },
            files
        })
        .then(d => this.client.actions.MessageCreate.handle(d)
            .message);
}
const voucher_codes = require('voucher-code-generator');
logs(client);
const is12HourVote = (date) => (date + 43200000) >= Date.now();
const is24hourVote = (date) => (date + 86400000) >= Date.now();
const isMonthlyVote = (date) => (new Date(date)
    .getMonth() == new Date()
    .getMonth());
const {
    inspect
} = require(`util`);
// Logger
const logger = require('./logger.js');
const colors = require("colors");
const shutDownCommands = ["rs", "restart", "shutdown", "sd", "bye", "q", ":q", "quit", "exit()"]

process.stdin.on('data', inputStdin => {
    const terminalCommand = Buffer.from(inputStdin, "utf-8").toString().trim()
    if (shutDownCommands.includes(terminalCommand)) process.exit(0)
});



client.logger = logger;

client.getBal = function getBal(user) {
        return client.db2.prepare(`SELECT * FROM Users WHERE user_id = ?`).get(user)

};
client.getPrefix = function getPrefix(guildID) {
    if (guildID) return (client.db.prepare(`SELECT prefix FROM Settings WHERE guildID = ?`).pluck().get(guildID) || client.botPrefix)
    else return client.botPrefix
}

client.setBal = function setBal(user, bal) {
        const balRaw = client.getBal(user)
        var hasUser = true;
        if (!balRaw) hasUser = false;
        if (hasUser) {
            // UPDATE
            client.db2.prepare(`UPDATE OR IGNORE Users SET balance = ? WHERE user_id = ?`)
                .run(bal, user)
        } else {
            // INSERT
            client.db2.prepare(`INSERT OR IGNORE INTO Users (user_id, balance) VALUES (?,?);`)
                .run(user, bal)
        }
};
client.setEcoLog = function setEcoLog(user, amount, reason) {
    const id = voucher_codes.generate({
        prefix: `ECO-`,
        pattern: "####-####-####",
        charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
    client.db2.prepare(`INSERT OR IGNORE INTO "eco-logs" (user_id, amount, reason, id, time) VALUES (?,?,?,?,?);`)
        .run(user, amount, reason, id, Date.now())
    return true;
};
Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}
String.prototype.capitalize = function () {
    return this.charAt(0)
        .toUpperCase() + this.slice(1)
}
client.randomNumber = function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
const categoryFiles = fs.readdirSync('./categories')
    .filter(file => file.endsWith('.js'));
for (const file of categoryFiles) {
    const category = require(`./categories/${file}`);
    if (!category) return console.warn(`${file} does not seem to export anything. Ignoring the category.`);
    if (!category.name) return console.warn(`${file} does not export a name. Ignoring the category.`);
    client.categories.set(category.name, category);
};
//CUSTOM FUNCTIONS HERE
client.isBotOwner = function (user) {
    if (!user) return false;
    if (typeof user == "string") {
        return client.botAdmins.includes(user)

    } else if (user.constructor.name == "GuildMember") {
        return client.botAdmins.includes(user.user.id)
    } else if (user.constructor.name == "User") {
        return client.botAdmins.includes(user.id)
    } else return false;
};
client.isGuildAdmin = async function (guild, member) {
    if (!guild) throw new TypeError("This guild does not exist!")
    if (!member) throw new TypeError("No guild member provided!")
    if (typeof guild == "string") guild = await client.guilds.fetch(guild)
    if (!guild) return false;

    if (typeof member == "string") member = await guild.members.fetch(member)
    if (!member) return false;
    if (member.constructor.name == "GuildMember") {
        if (!member.permissions) return false;
        if (member.permissions.toArray()
            .includes("ADMINISTRATOR") || client.botAdmins.includes(member.user.id)) return true;
        else return false;
    } else if (member.constructor.name == "User") {
        member = await guild.members.fetch(member.id)
        if (!member) return false;
        if (!member.permissions) return false;
        if (member.permissions.toArray()
            .includes("ADMINISTRATOR") || client.botAdmins.includes(member.user.id)) return true;
        else return false;


    } else return false;
};

client.fetchBotVotes = function (options) {
    var defaultOptions = {
        tags: true,
        site: "all"
    };
    if (!options) options = defaultOptions;
    if (options.tags == undefined || options.tags == null) options.tags = true;
    if (options.site == undefined || options.site == null) options.tags = true;
    return new Promise((resolve, reject) => {
        const votes = []
        let voteCheck = client.db2.prepare(`SELECT * FROM votes`)
        const voteDB = voteCheck.all()
            for (const boatVote of voteDB.filter(vote => vote.site == "boat" || vote.site == "dbl" || vote.site == "bfd" || vote.site == "dlabs" || vote.site == "vultrex")) {
                if (is12HourVote(boatVote.time)) {
                    // if (options.tags) votes.push({voter: `${voterPerson ? `${voterPerson.tag} (${voterPerson.id})` : boatVote.voter}`, site: boatVote.site})
                    votes.push({
                        voter: boatVote.voter,
                        site: boatVote.site
                    })
                };
            };
            for (const bfdVote of voteDB.filter(vote => vote.site == "space")) {
                if (is24hourVote(bfdVote.time)) {
                    // if (options.tags) votes.push({voter: `${voterPerson ? `${voterPerson.tag} (${voterPerson.id})` : bfdVote.voter}`, site: bfdVote.site})
                    votes.push({
                        voter: bfdVote.voter,
                        site: bfdVote.site
                    })
                };
            };
            return resolve(votes);
        });
};

client.getRecentVotes = function getRecentVotes() {
        const votes = []
        const voteDB = client.db2.prepare(`SELECT * FROM votes`)
            .all();
        for (const vote of voteDB)
            if (isMonthlyVote(vote.time)) votes.push(vote);
        return votes;
};
client.getCooldown = function getCooldown(cmd, user, time) {
        let cooldownCheck = client.db2.prepare(`SELECT * FROM "cooldowns" WHERE (userid = ? AND command = ? AND duration > ? ) ORDER BY duration DESC`)
        return cooldownCheck.get(user, cmd, time)
};

client.getTransactions = function getTransactions(user) {
        let cooldownCheck = client.db2.prepare(`SELECT * FROM "eco-logs" WHERE user_id = ? ORDER BY time DESC`)
        return cooldownCheck.all(user)
};
client.humanizeOption = function (string) {
    switch (string.toLowerCase()
        .trim()) {
    case "true":
    case "yes":
    case "1":
    case "on":
    case "activate":
        return true;
    case "false":
    case "no":
    case "0":
    case "off":
    case null:
    case "deactivate":
        return false;
    default:
        return Boolean(string);
    };
};

const commandhandler = require('./structures/CommandHandler');
const isStream = require("is-stream");

// REGISTER STUFF
const CommandHandler = new commandhandler(
    client,
    prefix, // Bot prefix to default to...
    './commands', // defaults you can change if you wish... these are defined at the command handler level.
    './events',
    './regexes'
);

Object.defineProperty(client, "CommandHandler", {
    enumerable: false,
    writable: true,
    value: CommandHandler
});
(async () => {
    await CommandHandler.registerRegexes()
        .catch(console.error);
    await CommandHandler.registerCommands()
        .catch(console.error);
    await CommandHandler.registerEvents()
        .catch(console.error);
    logger.log(`${client.commands.size} commands loaded!`);
})();
// Create statcord client
const statcord = new Statcord.Client({
    client,
    key: statcordToken,
    postCpuStatistics: true,
    /* Whether to post memory statistics or not, defaults to true */
    postMemStatistics: true,
    /* Whether to post memory statistics or not, defaults to true */
    postNetworkStatistics: true,
    /* Whether to post memory statistics or not, defaults to true */
});
Object.defineProperty(client, "statcord", {
    enumerable: false,
    writable: true,
    value: statcord
});
statcord.on("autopost-start", () => {
    // Emitted when statcord autopost starts
    logger.log(`Started autoposting to statcord.com! The bot page should be available at https://statcord.com/bot/${client.user.id}`);
});

process.on('unhandledRejection', async error => {
    const errorrr = error.stack || error.message || error || 'The error was so bad, I dont know what it is.';
    const errorID = client.utils.cryptoRandomString(5);
    client.error.set(errorID, errorrr, {
        type: "express"
    });
    //console.error(errorrr) ANNOYING ASF DEPRECATED
    const humanError = inspect(error, {
        depth: 2,
        maxArrayLength: null
    });
    try {
        client.channels.cache.get(`724104847342829661`)
            .send(new Discord.MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setTitle(`Traceback from recent error!`)
                .setDescription(`\`\`\`js\n${humanError.length > 1950 ? await Utils.post(humanError) : humanError}\`\`\``))
            .catch(() => {
                logger.error(`Couldn't send a traceback. The error was: `, errorrr);
            })
    } catch (e) {
        logger.error(`Couldn't send a traceback.`, e);
    }
});
// Require the framework and instantiate it
const app = fastify({
    trustProxy: true
})
client.app = app;
app.addHook('onSend', ({}, reply, {}, next) => {
    reply.removeHeader("X-Powered-By");
    next();
});
client.on(`ready`, async () => {
    const {success, failure} = require('./commands/unload').unloadCommands(require('./modules.json').commands.unloaded, client)
    logger.warn(colors.red(`${success.join(', ')} blacklisted from being loaded automatically. You're free to load the command(s) manually.`));
    if (failure.length) logger.error(`${failure.join(', ')} failed to be unloaded on ready.`)

    /**
     * Base API Route
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.get('/', function (req, reply) {
        reply.send({
            hello: 'world'
        })
    })
    /**
     * Testing Hook
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/test', function (req, reply) {
        if (!req.headers.authorization && !req.query.Authorization) return reply.code(403)
            .send({
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== apiKey && req.query.Authorization !== 'DONT-HACK-ME') {
            return reply.code(403)
                .send({
                    error: true,
                    message: 'Incorrect authorization key! Begoneeeee'
                })
        }
        console.log(req.headers, req.connection.remoteAddress)
        client.channels.cache.get('724104847342829661')
            .send(`\`\`\`js\nTEST WEBHOOK FIREDDD!\`\`\``)
        return reply.code(200)
            .send({
                error: false,
                message: "Webhook recorded."
            })
    })
    /**
     * Top.gg webhook
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/top.gg', (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists["top.gg-webhook"]) return reply.code(403)
            .send({
                error: true,
                message: 'Invalid authorization key.'
            })
        client.emit('onVote', {
            user: req.body.user,
            Votetype: 'top.gg',
            isWeekend: req.body.isWeekend,
            type: req.body.type
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * BotsForDiscord webhook
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/bfd', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists["bfd-webhook"]) return reply.code(403)
            .send({
                error: true,
                message: 'Invalid authorization key.'
            })
        client.emit('onVote', {
            user: req.body.user,
            Votetype: 'bfd',
            type: req.body.type || `Unknown`
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * DiscordList.Space webhook
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/space', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists['botlist.space']) return reply.code(403)
            .send({
                error: true,
                message: 'Invalid authorization key.'
            })

        client.emit('onVote', {
            user: req.body.user._id,
            Votetype: 'space',
            userObj: req.body.user,
            type: req.body.trigger || `Unknown`
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * DiscordLabs webhook
     * @param {fastify.FastifyRequest} req
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/dlabs', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists['dlabs-webhook']) return reply.code(403)
            .send({
                error: true,
                message: 'Invalid authorization key.'
            })

        client.emit('onVote', {
            user: req.body.uid,
            Votetype: 'dlabs',
            test: req.body.test
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * Discord.Boats webhook 
     * @param {fastify.FastifyRequest} req 
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/boat', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists["discord.boats-webhook"]) return reply.code(403)
            .send({
                error: true,
                message: 'Invalid authorization key.'
            })
        client.emit('onVote', {
            user: req.body.user.id,
            Votetype: 'boat',
            userObj: req.body.user
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * DiscordBotList webhook 
     * @param {fastify.FastifyRequest} req 
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/dbl', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: 'No authorization Key!'
            })
        if (req.headers.authorization !== client.config.botLists["discordbotlist.com-webhook"]) {
            return reply.code(403)
                .send({
                    error: true,
                    message: 'Incorrect authorization key! Begoneeeee'
                })
        }
        if (!req.body.id) return reply.code(200)
            .send({
                error: true,
                message: "You didn't provide a user ID."
            })
        const UserObj = {
            avatar: req.body.avatar,
            username: req.body.username,
            id: req.body.id,
            admin: req.body.admin
        }
        client.emit('onVote', {
            user: UserObj.id,
            Votetype: 'dbl',
            userObj: UserObj
        });
        return reply.code(200)
            .send({
                error: false
            })
    })
    /**
     * DiscordBots.co/Discordbotslist.co webhook 
     * @param {fastify.FastifyRequest} req 
     * @param {fastify.FastifyReply} reply
     */
    app.post('/hook/dbco', async (req, reply) => {
        if (!req.headers.authorization) return reply.code(403)
            .send({
                error: true,
                message: "No Authorization key provided."
            })
        if (req.headers.authorization !== client.config.botLists['dbco-webhook']) return reply.code(403)
            .send({
                error: true,
                message: "Authorization key is invalid."
            })
        if (!req.body.userId) return reply.code(403)
            .send({
                error: true,
                message: "No user was provided."
            });
        if (req.body.test) return reply.code(202)
            .send({
                error: false,
                message: "Webhook accepted, identified as an test webhook... Silently ignored."
            }) && logger.log(`Test webhook from discordbots.co. The body was:`, req.body);
        if (req.body.type == "vote") client.emit('onVote', {
            user: req.body.userId,
            Votetype: 'vultrex',
            type: req.body.type
        });
        else if (req.body.type == "review") client.emit('onVote', {
            user: req.body.userId,
            Votetype: 'vultrex',
            type: req.body.type,
            review: req.body.content,
            positive: req.body.positive
        });
        return reply.code(200)
            .send({
                error: false,
                message: "Webhook recorded."
            })
    })
    // Run the server!
    app.listen(1234, (err, address) => {
        if (err) {
            app.log.error(err)
            throw new Error(err);
        }
        app.log.info(`Server listening on ${address}`)
    })
})

module.exports = {
    client: client,
    app: app
};

client.start()