const {
    Client,
    ClientOptions,
    Collection
} = require("discord.js");
const DatabaseManager = require("./structures/DatabaseManager");
const colors = require("colors");
const UtilsRAW = require(`./Util/ClientUtil`);
const Utils = new UtilsRAW();
const logger = require('./logger')
const system = require("system-commands");
module.exports =
    class SentryClient extends Client {
        /**
         * Top donkey hacked client
         * @param {ClientOptions} options
         */
        constructor(options) {
            super(options);
            this.name = 'Sentry Alpha';
            this.config = require("./config.json");
            this.botAdmins = [this.config.ownerID];
            this.commands = new Collection();
            this.package = new Collection();
            this.aliases = new Collection();
            this.blacklist = new Collection();
            this.speedtest = new Collection();
            this.messages = new Collection();
            this.snipes = new Collection();
            this.editsnipes = new Collection();
            this.error = new Collection();
            this.guildConfigs = new Collection();
            this.guildSettings = new Collection();
            this.regexes = new Collection()
            this.utils = Utils;
            this.status = {
                name: `${this.config.prefix}help | sentry.best`,
                type: 'WATCHING',
            }
            this.talks = new Collection();
            this.prompts = new Collection();
            this.cooldowns = new Collection();
            this.configChannels = new Collection();
            this.categories = new Collection();
            this.logger = logger;
        }
        start() {
            this.DatabaseManager = new DatabaseManager(this);
            this.DatabaseManager.initalizeDatabase();
            this.DatabaseManager.fillCache();
            this.login(this.config.token)
                .catch(err => {
                    console.log(colors.brightRed(figlet.textSync('ERROR!', {
                        horizontalLayout: 'full'
                    })));
                    console.error(colors.bgRed(err));
                    if (process.env.PM2 === 'true') {
                        logger.info("Ending pm2 daemon.")
                        system(`pm2 stop ${process.env.name}`)
                    }
                })
        }
    }