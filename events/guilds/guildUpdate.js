const Discord = require('discord.js');

module.exports = (client, oldGuild, newGuild) => {
    const { db2: db } = client
            let newData = db.prepare(`UPDATE Settings SET guildName = ?, guildID = ? WHERE guildID = ? `);
            newData.run(newGuild.name, newGuild.id, oldGuild.id);
                const NewguildInfo = db.prepare(`SELECT * FROM Settings WHERE guildID = ?`).get(newGuild.id)
                client.guildSettings.delete(oldGuild.id)
                client.guildSettings.set(newGuild.id, NewguildInfo)
};