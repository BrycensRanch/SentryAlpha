
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
    const {db} = client;
  const guildOwner = client.users.cache.get(guild.ownerID)
  logger.info(`${client.user.tag} has joined the guild ${guild.name} (${guild.id})\nWhich was under the ownership of ${guildOwner ? guildOwner.tag : guild.ownerID}. (${guildOwner ? guildOwner.id : guild.ownerID})\nThis guild has ${guild.members.cache.size} members.`)

  let insertdata = db.prepare(`INSERT OR IGNORE INTO "Settings" (guildID, guildName, premium, prefix) VALUES(?,?,?,?)`)
  insertdata.run(guild.id, guild.name, false, client.config.prefix);
  let insertdata2 = db.prepare(`INSERT OR IGNORE INTO "Guild Settings" (remove_roles, admin, snipe, spellcheck) VALUES(?,?,?,?)`)
  insertdata2.run(guild.id, true, false, true, true);
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
  guildEmbed.addField('Statistics', `Members: ${guild.members.cache.size}\nBots: ${guild.members.cache.filter(x => x.user.bot).size}\nChannels: ${guild.channels.cache.size}\nFeatures:\n \`\`\`${guild.features.length? `-` : ``} ${guild.features.map(str => str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())).join("\n- ")}\`\`\`\nCreated At: ${new Date(guild.createdTimestamp).toLocaleString()} EST\nEmojis: ${guild.emojis.cache.size}\nRoles: ${guild.roles.cache.size}`)
  guildEmbed.addField("Additional Information", `🌐 Region: ${capitalize(guild.region)}\n Guild ID: ${guild.id}\nVerification Level: ${guild.verificationLevel.toLowerCase().charAt(0).toUpperCase() + guild.verificationLevel.toLowerCase().slice(1)}`)
  guildEmbed.addField("Boosting Information", `🌟 Tier ${guild.premiumTier} guild, currently has ${guild.premiumSubscriptionCount} boosts.`)
  if (guild.icon) guildEmbed.setThumbnail(`${guild.iconURL({dynamic: true, size: 4096, format: "png"})}`)
  else guildEmbed.setThumbnail(backupIconURL)
  if (guild.banner) guildEmbed.setImage(`${guild.bannerURL({dynamic: true, size: 4096, format: "png"}) || "https://sentryalpha.xyz/wp-content/uploads/2020/08/cropped-logo_transparent_coloured-32x32.png"}`)
  guildEmbed.setTimestamp()
  guildEmbed.setFooter(`Level ${guild.premiumTier} Server`);
  var welcomeText = "New guild!"
  if (guild.members.cache.filter(x => !x.user.bot).size > 99) welcomeText = `New large guild! <@${client.botAdmins[0]}> look at this! <:emoji_19:620491393051131914>`
  if (guild.members.cache.filter(x => !x.user.bot).size > 499) welcomeText = `New ultra large guild! <@${client.botAdmins[0]}> look at this! <:emoji_19:620491393051131914>`
  if (guild.members.cache.filter(x => !x.user.bot).size > 999) welcomeText = `New crazy large guild! <@${client.botAdmins[0]}> look at this! <:emoji_19:620491393051131914>`
  feed.send(welcomeText + ` \`\`${guild.name}\`\` is now apart of the ${client.guilds.cache.size} guilds ${client.user.tag} brings fun into.`, guildEmbed, {
      disableMentions: "everyone"
  }).catch(err => {
      logger.error(`Couldn't alert the support server of changes!`)
      console.error(err)
  })
};