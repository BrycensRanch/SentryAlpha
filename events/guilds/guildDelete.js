const Discord = require('discord.js');
const logger = require('../../logger.js');
const capitalize = (text) => {
    text = text.replace(/-/g, ' ')
    const arr = text.split(' ');
    if (arr.length < 2) {
        return `${arr[0][0].toUpperCase()}${arr[0].slice(1)}`
    } else {
        return `${arr[0].toUpperCase()} ${arr[1][0].toUpperCase()}${arr[1].slice(1)}`;
    } 
};
module.exports = async (client, guild) => {
    const guildOwner = client.users.cache.get(guild.ownerID)
    logger.info(`${client.user.tag} has left the guild ${guild.name} (${guild.id})\nWhich was under the ownership of ${guildOwner ? guildOwner.tag : guild.ownerID}. (${guildOwner ? guildOwner.id : guild.ownerID})\nThis guild had ${guild.members.cache.size} members.`)
    const feed = client.channels.cache.get('724005564824158238');
    if (!feed) return;
    var backupIconURL;
    if (!guild.icon) {
        await fetch("https://fontmeme.com/loadme_21.php", {
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            "referrer": "https://fontmeme.com/discord-logo-font/",
            "body": "name=Uni+Sans+Heavy.ttf&text=" + encodeURIComponent(guild.nameAcronym) + "&size=165&style_color=2C59D4&style_effect=Gradient-V&style_ol=X3&style_col=7B89F4",
            "method": "POST"
        }).then(async res => await res.text().then(txt => {
            backupIconURL = txt
        }))
        await fetch("https://fontmeme.com/updateurl.php", {
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            "referrer": "https://fontmeme.com/discord-logo-font/",
            "body": `imgN=${encodeURIComponent(backupIconURL)}&urlP=https%3A%2F%2Ffontmeme.com%2Fdiscord-logo-font%2F`,
            "method": "POST",
        }).then(async res => await res.json().then(json => {
          backupIconURL = json.d3
      }))
    }
    const guildEmbed = new Discord.MessageEmbed()
    guildEmbed.setColor('RANDOM')
    guildEmbed.setTitle(guild.name)
    guildEmbed.setAuthor(client.users.cache.get(guild.ownerID).tag, client.users.cache.get(guild.ownerID).displayAvatarURL({
        size: 4096,
        dynamic: true,
        format: "png"
    }))
    guildEmbed.addField('Statistics', `Members: ${guild.members.cache.size}\nBots: ${guild.members.cache.filter(x => x.user.bot).size}\nChannels: ${guild.channels.cache.size}\nFeatures:\n \`\`\`${guild.features.length ? `-` :``} ${guild.features.map(str => str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())).join("\n- ")}\`\`\`\nCreated At: ${new Date(guild.createdTimestamp).toLocaleString()} EST\nJoined: ${new Date(guild.joinedTimestamp).toLocaleString()} EST (${client.ago(new Date(guild.joinedTimestamp))})\nEmojis: ${guild.emojis.cache.size}\nRoles: ${guild.roles.cache.size}`)
    guildEmbed.addField("Additional Information", `🌐 Region: ${capitalize(guild.region)}\n Guild ID: ${guild.id}\nVerification Level: ${guild.verificationLevel.toLowerCase().charAt(0).toUpperCase() + guild.verificationLevel.toLowerCase().slice(1) }`)
    guildEmbed.addField("Boosting Information", `🌟 Tier ${guild.premiumTier} guild, currently had ${guild.premiumSubscriptionCount} boosts.`)
    guildEmbed.addField("Database Information", `<a:emoji_71:621114969508937749>  | Deletion date: ${new Date(new Date().getTime + 2.592e9).toLocaleString()}`)
    if (guild.icon) guildEmbed.setThumbnail(`${guild.iconURL({dynamic: true, size: 4096, format: "png"})}`)
    else guildEmbed.setThumbnail(backupIconURL)
    if (guild.banner) guildEmbed.setImage(`${guild.bannerURL({dynamic: true, size: 4096, format: "png"}) || "https://sentryalpha.xyz/wp-content/uploads/2020/08/cropped-logo_transparent_coloured-32x32.png"}`)
    guildEmbed.setTimestamp()
    guildEmbed.setFooter(`Level ${guild.premiumTier} Server lost...`);
    var byeText = "Lost a guild!"
    if (guild.members.cache.filter(x => !x.user.bot).size > 99) byeText = `Lost a large guild! <@${client.botAdmins[0]}> look at this sad moment! <:emoji_18:620491370855137301>`
    if (guild.members.cache.filter(x => !x.user.bot).size > 499) byeText = `Lost a ultra large guild! <@${client.botAdmins[0]}> look at this unepic gamer moment! <:emoji_42:620499080866562049> `
    if (guild.members.cache.filter(x => !x.user.bot).size > 999) byeText = `Lost a crazy large guild! <@${client.botAdmins[0]}> IM ON FIRE IM DYING!!! <a:emoji_48:620499620291674112>`
    feed.send(byeText + ` \`\`${guild.name}\`\` was apart of the ${client.guilds.cache.size} guilds ${client.user.tag} brought fun into. Oh well, they're on their own.`, guildEmbed, {
        disableMentions: "everyone"
    }).catch(err => {
        logger.error(`Couldn't alert the support server of changes!`)
        console.error(err)
    })
};