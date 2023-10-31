const Discord = require('discord.js');
module.exports = {
    name: 'clearsettings',
    aliases: [`cleardb`, `purgedb`, `cleardatabase`],
    cooldown: 30,
    description: "Clear the database or have a new one created for you if you didn't have one yet! :children_crossing: ",
    async execute(message, args, client) {

        if (message.author.id !== client.config.ownerID && message.author.id !== message.guild.ownerID) {
            message.channel.send(`You should of seen your mom's database when I cleaned her's out. <:Nooneusesme:697300396758007860>`)
        }
        if (message.author.id == client.config.ownerID || message.author.id == message.guild.ownerID) {
            message.channel.send('Prompt generated, say ``yes`` or ``no`` to continue. This will delete everything you have set and including your personal user database for this server! You have 10 seconds.')
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 10000,
                max: 1,
                errors: ['time']
            });
            const { db } = client
            collector.on('collect', async message => {
                if (message.content == `yes`) {
                    const initMsg = await message.channel.send(`Clearing database...`)
                    if (client.guildSettings.has(message.guild.id)) {
                        client.guildSettings.set(message.guild.id, {
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            premium: client.guildSettings.premium || "false",
                            prefix: client.config.prefix
                        })
                    }
                        deletedata = db.prepare(`DELETE FROM Settings WHERE guildID = ${message.guild.id}`);
                        deletedata.run();
                        let insertdata1 = db.prepare(`INSERT OR IGNORE INTO "Settings" VALUES(?,?,?,?)`)
                        insertdata1.run(message.guild.id, message.guild.name, `false`, client.config.prefix);
                        deleteConfig = db.prepare(`DELETE FROM "Guild Settings" WHERE guildID = ?`);
                        deleteConfig.run(message.guild.id)
                        let insertdata2 = db.prepare(`INSERT OR IGNORE INTO "Guild Settings" VALUES(?,?,?,?,?,?)`)
                        insertdata2.run(message.guild.id, 'false', 'false', 'true', 'false', 'true')
                    collector.on('error', async err => {
                        return message.channel.send('Bruh you got Mcdonalds wifi or something??? cant even respond in 10 seconds like how slow you type!?!??!')
                    })
                    console.log(`THE ${message.guild.name} (${message.guild.id}) DATABASE HAS BEEN CLEARED BY ${message.author.tag}`)
                    initMsg.edit(` :thumbsup:  The guild settings has been cleared. This means your prefix, your mod roles, etc your is reset back to defaults. Enjoy!`)
                } else if (message.content !== `yes`) {
                    return message.channel.send(`Prompt cancelled, you should of just said yes.`);
                }
            })
        }
    },
}