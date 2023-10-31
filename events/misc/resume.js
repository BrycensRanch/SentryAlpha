
const Discord = require('discord.js');

module.exports = (client, resumee) => {
  client.logger.log("The bot lost connection to Discord, however we've reconnected. I've reset the status aswell.")
  client.user.setPresence({
      status: 'dnd',
      activity: {
          name: client.status.name,
          type: client.status.type,
      }
  })
};