
module.exports = (client, message) => {
  if (message.author.bot == true) return;
  if (message.type !== "DEFAULT") return;
  client.snipes.set(message.id, {
      content: message.content,
      author: message.author,
      channel: message.channel.id,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      timestamp: message.createdTimestamp,
      id: message.id,
      reference: message.reference,
      attachments: message.attachments.map(x => `[${x.name}](${x.width ? x.proxyURL : x.url})`)
  });
  setTimeout(function() {
      client.snipes.delete(message.id);
  }, 600000);
};