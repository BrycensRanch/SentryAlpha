const {
  FastifyRequest,
  FastifyReply
} = require('fastify');
const Discord = require("discord.js");
const SentryClient = require("../SentryClient")
// Botlist class for botlists yes
class BotList {
      /**
     * Top donkey bot list
     * @param {SentryClient} client 
     * @param {object} options 
     */
  constructor(client, options) {
      if (!options) options = {
         name: "Discord BotList",
         url: "URL"
      }
      this.client = client;
      this.name = options.name || "Discord BotList"
      this.link = options.url || "URL"
      this.id = options.id
      this.postURL = options.postURL
      this.webhookURL = options.webhookURL
  /**
   * Handle Requests Function
   * @type {function}
   * @param {FastifyRequest} req
   * @param {FastifyReply} reply
   */
      this.handleRequests = options.handleRequests
    /**
   * Post Stats Function
   * @type {function}
   */
      this.postStats = options.postStats
  }
  sendAlert(vote) {
  /**
   * Alerts Channel
   * @type {Discord.TextChannel}
   */
    const alertChannel = await this.client.channels.fetch(this.client.config.channels.alertChannel);
    var voteUser = await this.client.users.fetch(vote.user?.id || vote.user)
    alertChannel.send(`<:ivoted:773006580035747882> | New vote from ${this.name}! Epic, thank you <@${vote.user}> for voting!`, new Discord.MessageEmbed().setColor("GREEN") .setDescription(`Thank you for voting for ${this.client.user.username}, ${voterUser ? `${voterUser.tag}! (${voterUser.id})`: `Thank you Unknown user ${vote.user}! Maybe one day I'll see your face.`}\n\nIf you haven't voted already, **[Click here](${this.link})** and make sure you're logged in.`))
  }
}
module.exports = BotList;