const {
    EventEmitter
} = require("events")
const SentryClient = require("../SentryClient");
class DatabaseManager extends EventEmitter {
    /**
     * Top donkey command handler
     * @param {SentryClient} client - The discord.js this.client instance to run on.
     */
    constructor(client) {
        super();
        Object.defineProperty(this, "client", {
            enumerable: false,
            writable: true,
            value: client
        });
    }
    initalizeDatabase() {
        this.client.db = require('better-sqlite3')('database.db');
        this.client.db2 = require('better-sqlite3')('data.db');
        this.client.logger.log("The database connections have been initialized.")
    }
    fillCache() {
        const guildSettings = this.client.db.prepare(`SELECT * FROM Settings`)
            .all();
        for (const guild of guildSettings) {
            this.serialize(guild);
            this.client.guildSettings.set(guild.guildID, guild);
        };
        const guildConfig = this.client.db.prepare(`SELECT * FROM "Guild Settings"`)
            .all();

        for (const config of guildConfig) {
            this.serialize(config);
            this.client.guildConfigs.set(config.guildID, config);
        };
        const guildChannels =  this.client.db.prepare(`SELECT * FROM "Guild Channels"`)
            .all();
        for (const configChannel of guildChannels) {
            this.serialize(configChannel);
            this.client.configChannels.set(configChannel.guildID, configChannel);
        };

        const blacklisted = this.client.db2.prepare(`SELECT * FROM blacklistedUsers`)
            .all();

        for (const user of blacklisted) {
            this.serialize(user);
            this.client.blacklist.set(user, this.client.users.cache.get(user));
        };
    }
    serialize(obj) {
        if (typeof obj !== "object") throw new TypeError(`Not the correct type. Got a ${typeof obj} instead of a object.`);
        for (const [key] of Object.entries(obj)) {
            if (obj[key] == "false") obj[key] = false;
            if (obj[key] == "true") obj[key] = true;
            if (obj[key] === 1) obj[key] = true;
            if (obj[key] === 0) obj[key] = false;
        }
        return obj;
    };

}
module.exports = DatabaseManager;