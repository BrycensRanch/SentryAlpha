const {
    Collection,
    MessageAttachment,
    MessageEmbed,
    Permissions,
    Snowflake,
    User
} = require('discord.js');
const {
    dirname,
    basename
} = require("path");
const {
    randomBytes
} = require('crypto');
const fetch = require("node-fetch");
const permissions = {
    CREATE_INSTANT_INVITE: 1,
    KICK_MEMBERS: 2,
    BAN_MEMBERS: 4,
    ADMINISTRATOR: 8,
    MANAGE_CHANNELS: 16,
    MANAGE_GUILD: 32,
    ADD_REACTIONS: 64,
    VIEW_AUDIT_LOG: 128,
    PRIORITY_SPEAKER: 256,
    STREAM: 512,
    VIEW_CHANNEL: 1024,
    SEND_MESSAGES: 2048,
    SEND_TTS_MESSAGES: 4096,
    MANAGE_MESSAGES: 8192,
    EMBED_LINKS: 16384,
    ATTACH_FILES: 32768,
    READ_MESSAGE_HISTORY: 65536,
    MENTION_EVERYONE: 131072,
    USE_EXTERNAL_EMOJIS: 262144,
    VIEW_GUILD_INSIGHTS: 524288,
    CONNECT: 1048576,
    SPEAK: 2097152,
    MUTE_MEMBERS: 4194304,
    DEAFEN_MEMBERS: 8388608,
    MOVE_MEMBERS: 16777216,
    USE_VAD: 33554432,
    CHANGE_NICKNAME: 67108864,
    MANAGE_NICKNAMES: 134217728,
    MANAGE_ROLES: 268435456,
    MANAGE_WEBHOOKS: 536870912,
    MANAGE_EMOJIS: 1073741824
};
const faces = [
    '(*^ω^)',
    '(◕‿◕✿)',
    '(◕ᴥ◕)',
    'ʕ•ᴥ•ʔ',
    'ʕ￫ᴥ￩ʔ',
    '(*^.^*)',
    'owo',
    'OwO',
    '(｡♥‿♥｡)',
    'uwu',
    'UwU',
    '(*￣з￣)',
    '>w<',
    '^w^',
    '(つ✧ω✧)つ',
    '(/ =ω=)/',
    '~~'
    // TODO: Add more
];
var units = [
    { name: ' second', value: 1000, max: 50, single: 'a second' },
    { name: ' minute', value: 60000, max: 50, single: 'a minute' },
    { name: ' hour', value: 3600000, max: 22, single: 'an hour' },
    { name: ' day', value: 86400000, max: 6, single: 'a day' },
    { name: ' week', value: 604800000, max: 3.5, single: 'a week' },
    { name: ' month', value: 2592000000, max: 11, single: 'a month' },
    { name: ' year', value: 31536000000, max: Infinity, single: 'a year' }
];

/**
 * Client utilities to help with common tasks.
 */
class ClientUtil {
    constructor() {}
    /**
     * Resolves a user from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, User>} users - Collection of users to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {User}
     */
    resolveUser(text, users, caseSensitive = false, wholeWord = false) {
        return users.get(text) || users.find(user => this.checkUser(text, user, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple users from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, User>} users - Collection of users to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, User>}
     */
    resolveUsers(text, users, caseSensitive = false, wholeWord = false) {
        return users.filter(user => this.checkUser(text, user, caseSensitive, wholeWord));
    }
    convertReadable(permName, readable = true, debug = false) {
        if (!readable) return permName;
        if (debug) logger.info(permName);
        let names = {
            CREATE_INSTANT_INVITE: "Create Instant Invite",
            KICK_MEMBERS: "Kick Members",
            BAN_MEMBERS: "Ban Members",
            ADMINISTRATOR: "Administrator",
            MANAGE_CHANNELS: "Manage Channels",
            MANAGE_GUILD: "Manage Guild",
            ADD_REACTIONS: "Add Reactions",
            VIEW_AUDIT_LOG: "View Audit Log",
            PRIORITY_SPEAKER: "Priority Speaker",
            STREAM: "Stream",
            VIEW_CHANNEL: "View Channel",
            READ_MESSAGES: "Read Messages",
            SEND_MESSAGES: "Send Messages",
            SEND_TTS_MESSAGES: "Send TTS Messages",
            MANAGE_MESSAGES: "Manage Messages",
            EMBED_LINKS: "Embed Links",
            ATTACH_FILES: "Attach Files",
            READ_MESSAGE_HISTORY: "Read Message History",
            MENTION_EVERYONE: "Mention Everyone",
            EXTERNAL_EMOJIS: "External Emojis",
            USE_EXTERNAL_EMOJIS: "Use External Emojis",
            VIEW_GUILD_INSIGHTS: "View Guild Insights",
            CONNECT: "Connect",
            SPEAK: "Speak",
            MUTE_MEMBERS: "Mute Members",
            DEAFEN_MEMBERS: "Deafen Members",
            MOVE_MEMBERS: "Move Members",
            USE_VAD: "Use Voice Activity",
            CHANGE_NICKNAME: "Change Nickname",
            MANAGE_NICKNAMES: "Manage Nicknames",
            MANAGE_ROLES: "Manage Roles",
            MANAGE_ROLES_OR_PERMISSIONS: "Manage Roles",
            MANAGE_WEBHOOKS: "Manage Webhooks",
            MANAGE_EMOJIS: "Manage Emojis"
        };

        if (!names[permName]) throw new RangeError("Invalid permission given!");
        return names[permName];
    };
    uwuify(str) {
        return str
            .replace(/(?:l|r)/g, 'w')
            .replace(/(?:L|R)/g, 'W')
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/N([aeiou])|N([AEIOU])/g, 'Ny$1')
            .replace(/ove/gi, 'uv')
            .replace(/nd(?= |$)/gi, 'ndo')
            .replace(/([!])+/g, v => ` ${faces[Math.floor(Math.random() * faces.length)]}`)
            .replace(/([.])+/g, v => ` ${faces[Math.floor(Math.random() * faces.length)]}`);
    }
    convertPerms(permNumber, readableNames = false, debug = false) {
        //if readableNames is set to true, use the names at Discord instead of the names of PermissionResolvables at discord.js.
        if (isNaN(Number(permNumber))) throw new TypeError(`Expected permissions number, and received ${typeof permNumber} instead.`);
        permNumber = Number(permNumber);
        let evaluatedPerms = {};
        for (let perm in permissions) {
            let hasPerm = Boolean(permNumber & permissions[perm]);
            evaluatedPerms[convertReadable(perm, readableNames, debug)] = hasPerm;
        }
        return evaluatedPerms;
    };
    /**
     * Checks if a string could be referring to a user.
     * @param {string} text - Text to check.
     * @param {User} user - User to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkUser(text, user, caseSensitive = false, wholeWord = false) {
        if (user.id === text) return true;

        const reg = /<@!?(\d{17,19})>/;
        const match = text.match(reg);

        if (match && user.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const username = caseSensitive ? user.username : user.username.toLowerCase();
        const discrim = user.discriminator;

        if (!wholeWord) {
            return username.includes(text) ||
                (username.includes(text.split('#')[0]) && discrim.includes(text.split('#')[1]));
        }

        return username === text ||
            (username === text.split('#')[0] && discrim === text.split('#')[1]);
    }

    /**
     * Resolves a member from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, GuildMember>} members - Collection of members to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {GuildMember}
     */
    resolveMember(text, members, caseSensitive = false, wholeWord = false) {
        return members.get(text) || members.find(member => this.checkMember(text, member, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple members from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, GuildMember>} members - Collection of members to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, GuildMember>}
     */
    resolveMembers(text, members, caseSensitive = false, wholeWord = false) {
        return members.filter(member => this.checkMember(text, member, caseSensitive, wholeWord));
    }

    /**
     * Checks if a string could be referring to a member.
     * @param {string} text - Text to check.
     * @param {GuildMember} member - Member to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkMember(text, member, caseSensitive = false, wholeWord = false) {
        if (member.id === text) return true;

        const reg = /<@!?(\d{17,19})>/;
        const match = text.match(reg);

        if (match && member.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const username = caseSensitive ? member.user.username : member.user.username.toLowerCase();
        const displayName = caseSensitive ? member.displayName : member.displayName.toLowerCase();
        const discrim = member.user.discriminator;

        if (!wholeWord) {
            return displayName.includes(text) ||
                username.includes(text) ||
                ((username.includes(text.split('#')[0]) || displayName.includes(text.split('#')[0])) && discrim.includes(text.split('#')[1]));
        }

        return displayName === text ||
            username === text ||
            ((username === text.split('#')[0] || displayName === text.split('#')[0]) && discrim === text.split('#')[1]);
    }
    /**
     * Resolves a channel from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Channel>} channels - Collection of channels to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Channel}
     */
    resolveChannel(text, channels, caseSensitive = false, wholeWord = false) {
        return channels.get(text) || channels.find(channel => this.checkChannel(text, channel, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple channels from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Channel>} channels - Collection of channels to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, Channel>}
     */
    resolveChannels(text, channels, caseSensitive = false, wholeWord = false) {
        return channels.filter(channel => this.checkChannel(text, channel, caseSensitive, wholeWord));
    }
    /**
     * Makes a random string with a given charset.
     * @param {Number} length - How many random characters to make.
     * * @param {String} chars - The charset to use.
     * @returns {String}
     */
    randomString(length, chars) {
        if (!chars) {
            throw new Error('Argument \'chars\' is undefined');
        }

        var charsLength = chars.length;
        if (charsLength > 256) {
            throw new Error('Argument \'chars\' should not have more than 256 characters' +
                ', otherwise unpredictability will be broken');
        }

        var RandomBytes = randomBytes(length);
        var result = new Array(length);

        var cursor = 0;
        for (var i = 0; i < length; i++) {
            cursor += RandomBytes[i];
            result[i] = chars[cursor % charsLength];
        }

        return result.join('');
    }
    /**
     * Makes a random string.
     * @param {Number} length - How many random characters to make.
     * @returns {String}
     */
    cryptoRandomString(length) {
        return this.randomString(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    }
    /**
     * Check whether a string is a valid HTTP URL.
     * @param {Number} url - The URL to check.
     * @returns {Boolean} 
     */
    isUrl(url) {
        if (!url) throw new TypeError(`No URL to check provided.`);
        const typeOfUrl = typeof url;

        if (typeOfUrl !== 'string') {
            throw new TypeError(`
            URL type is invalid. Expected a string, but got: ${typeOfUrl}
          `);
        }
        url = url.replace(/ /g, "%20");
        const protocol = '(?:(?:https?)://)';
        const ipv4 = '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))';
        const hostname = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
        const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
        const tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))';
        const port = '(?::\\d{2,5})?';
        const resourcePath = '(?:[/?#]\\S*)?';
        const regex = `${protocol}(?:localhost|${ipv4}|${hostname}${domain}${tld}\\.?)${port}${resourcePath}`;
        const isURL = new RegExp(`^${regex}$`, 'i');
        return isURL.test(url.R);
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
                    type: 'single',
                    value: match[2]
                });
            } else if (match[1]) {
                // Double quoted group
                matches.push({
                    type: 'double',
                    value: match[1]
                });
            } else {
                // No quote group present
                matches.push({
                    type: 'plain',
                    value: match[0]
                });
            }
        }

        return matches;
    }
    /**
     * This function splits spaces and creates an array of strings, like if you were to use `String.split(...)`, but without splitting the spaces in between quotes.
     * @param string The string to split.
     * @see parseDetailed
     */
    parse(string) {
        return this.parseDetailed(string)
            .map(details => details.value);
    }
    /**
     * Uploads to a hastebin.
     * @param {Object|String|Number} content - The content to upload.
     * @param {String} url - The URL to upload to.
     * @returns {Promise<String>} The URL of the paste.
     * @example
     * const UtilsRAW = require(`../Util/ClientUtil`);
     * const Utils = new UtilsRAW();
     * 
     * Utils.post("Lorem ipsum")
     *      .then(url => console.log(url))
     *      .catch(err => console.log(err));
     */
    async post(content, url) {
        if (url) url = url.endsWith("/documents") ? url : url + "/documents";
        else url = `https://hasteb.in/documents`;
        const res = await fetch(url, {
            method: "POST",
            timeout: 2000,
            body: content
        });

        if (res.status === 200) {
            const json = await res.json();
            return `${url.slice(0, -10)}/${json.key}`;
        }
        return this.ThrowError("HTTPError", `${url} returned a ${res.statusText} error.`)
            .toString();
    }
    /**
     * Uploads to a hastebin.
     * @param {String} searchURL - The URL to upload to.
     * @returns {Promise<String>} The URL of the paste.
     * @example
     * const UtilsRAW = require(`../Util/ClientUtil`);
     * const Utils = new UtilsRAW();
     * 
     * Utils.getPaste("https://hasteb.in/izifajav")
     *      .then(content => console.log(content))
     *      .catch(err => console.log(err));
     */
    async getPaste(searchURL) {
        if (!searchURL) return this.ThrowError("ModuleError", `You didn't provide a Search URL.`)
            .toString();
        searchURL = dirname(searchURL) + "/raw/" + basename(searchURL)
        const res = await fetch(searchURL, {
            method: "GET",
            timeout: 2000,
        });

        if (res.status === 200) {
            const text = await res.text();
            return text;
        }
        return this.ThrowError("HTTPError", `${searchURL} returned a ${res.statusText} error.`)
            .toString();
    }
    ThrowError(name, message) {
        if (name) {
            const e = new Error(message);
            e.name = name;
            return e;
        } else return new Error(message);
    }
    /**
     * Checks if a string could be referring to a channel.
     * @param {string} text - Text to check.
     * @param {Channel} channel - Channel to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkChannel(text, channel, caseSensitive = false, wholeWord = false) {
        if (channel.id === text) return true;

        const reg = /<#(\d{17,19})>/;
        const match = text.match(reg);

        if (match && channel.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? channel.name : channel.name.toLowerCase();

        if (!wholeWord) {
            return name.includes(text) ||
                name.includes(text.replace(/^#/, ''));
        }

        return name === text ||
            name === text.replace(/^#/, '');
    }

    /**
     * Resolves a role from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Role>} roles - Collection of roles to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Role}
     */
    resolveRole(text, roles, caseSensitive = false, wholeWord = false) {
        return roles.get(text) || roles.find(role => this.checkRole(text, role, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple roles from a string, such as an ID, a name, or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Role>} roles - Collection of roles to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, Role>}
     */
    resolveRoles(text, roles, caseSensitive = false, wholeWord = false) {
        return roles.filter(role => this.checkRole(text, role, caseSensitive, wholeWord));
    }

    /**
     * Checks if a string could be referring to a role.
     * @param {string} text - Text to check.
     * @param {Role} role - Role to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkRole(text, role, caseSensitive = false, wholeWord = false) {
        if (role.id === text) return true;

        const reg = /<@&(\d{17,19})>/;
        const match = text.match(reg);

        if (match && role.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? role.name : role.name.toLowerCase();

        if (!wholeWord) {
            return name.includes(text) ||
                name.includes(text.replace(/^@/, ''));
        }

        return name === text ||
            name === text.replace(/^@/, '');
    }

    /**
     * Resolves a custom emoji from a string, such as a name or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Emoji>} emojis - Collection of emojis to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Emoji}
     */
    resolveEmoji(text, emojis, caseSensitive = false, wholeWord = false) {
        return emojis.get(text) || emojis.find(emoji => this.checkEmoji(text, emoji, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple custom emojis from a string, such as a name or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Emoji>} emojis - Collection of emojis to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, Emoji>}
     */
    resolveEmojis(text, emojis, caseSensitive = false, wholeWord = false) {
        return emojis.filter(emoji => this.checkEmoji(text, emoji, caseSensitive, wholeWord));
    }

    /**
     * Checks if a string could be referring to a emoji.
     * @param {string} text - Text to check.
     * @param {Emoji} emoji - Emoji to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkEmoji(text, emoji, caseSensitive = false, wholeWord = false) {
        if (emoji.id === text) return true;

        const reg = /<a?:[a-zA-Z0-9_]+:(\d{17,19})>/;
        const match = text.match(reg);

        if (match && emoji.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? emoji.name : emoji.name.toLowerCase();

        if (!wholeWord) {
            return name.includes(text) ||
                name.includes(text.replace(/:/, ''));
        }

        return name === text ||
            name === text.replace(/:/, '');
    }

    /**
     * Resolves a guild from a string, such as an ID or a name.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Guild>} guilds - Collection of guilds to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Guild}
     */
    resolveGuild(text, guilds, caseSensitive = false, wholeWord = false) {
        return guilds.get(text) || guilds.find(guild => this.checkGuild(text, guild, caseSensitive, wholeWord));
    }

    /**
     * Resolves multiple guilds from a string, such as an ID or a name.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Guild>} guilds - Collection of guilds to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Collection<Snowflake, Guild>}
     */
    resolveGuilds(text, guilds, caseSensitive = false, wholeWord = false) {
        return guilds.filter(guild => this.checkGuild(text, guild, caseSensitive, wholeWord));
    }

    /**
     * Checks if a string could be referring to a guild.
     * @param {string} text - Text to check.
     * @param {Guild} guild - Guild to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkGuild(text, guild, caseSensitive = false, wholeWord = false) {
        if (guild.id === text) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? guild.name : guild.name.toLowerCase();

        if (!wholeWord) return name.includes(text);
        return name === text;
    }

    /**
     * Array of permission names.
     * @returns {string[]}
     */
    permissionNames() {
        return Object.keys(Permissions.FLAGS);
    }

    /**
     * Resolves a permission number and returns an array of permission names.
     * @param {number} number - The permissions number.
     * @returns {string[]}
     */
    resolvePermissionNumber(number) {
        const resolved = [];

        for (const key of Object.keys(Permissions.FLAGS)) {
            if (number & Permissions.FLAGS[key]) resolved.push(key);
        }

        return resolved;
    }

    /**
     * Compares two member objects presences and checks if they stopped or started a stream or not.
     * Returns `0`, `1`, or `2` for no change, stopped, or started.
     * @param {GuildMember} oldMember - The old member.
     * @param {GuildMember} newMember - The new member.
     * @returns {number}
     */
    compareStreaming(oldMember, newMember) {
        const s1 = oldMember.presence.activity && oldMember.presence.activity.type === 'STREAMING';
        const s2 = newMember.presence.activity && newMember.presence.activity.type === 'STREAMING';
        if (s1 === s2) return 0;
        if (s1) return 1;
        if (s2) return 2;
        return 0;
    }
    // Thanks https://github.com/brams-dev/friendly-time
    ago(date) {
        var diff = Date.now() - date.getTime();
    
        var future = diff < 0;
        diff = Math.abs(diff);
    
        if (!future && diff < 10000) return 'just now';
        if (future && diff < 5000) return 'any second';
    
        var suffix = future ? ' from now' : ' ago';
    
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
    
            if (diff <= unit.max * unit.value) {
                var t = Math.round(diff / unit.value);
                return t === 1 ? unit.single + suffix : t + unit.name + 's' + suffix;
            }
        }
    }
    
    /**
     * Combination of `<Client>.fetchUser()` and `<Guild>.fetchMember()`.
     * @param {Guild} guild - Guild to fetch in.
     * @param {string} id - ID of the user.
     * @param {boolean} cache - Whether or not to add to cache.
     * @returns {Promise<GuildMember>}
     */
    async fetchMember(guild, id, cache) {
        const user = await this.client.users.fetch(id, cache);
        return guild.members.fetch(user, cache);
    }

    /**
     * Makes a MessageEmbed.
     * @param {Object} [data] - Embed data.
     * @returns {MessageEmbed}
     */
    embed(data) {
        return new MessageEmbed(data);
    }

    /**
     * Makes a MessageAttachment.
     * @param {BufferResolvable|Stream} file - The file.
     * @param {string} [name] - The filename.
     * @returns {MessageAttachment}
     */
    attachment(file, name) {
        return new MessageAttachment(file, name);
    }

    /**
     * Makes a Collection.
     * @param {Iterable} [iterable] - Entries to fill with.
     * @returns {Collection}
     */
    collection(iterable) {
        return new Collection(iterable);
    }
}

module.exports = ClientUtil;