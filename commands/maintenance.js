const Discord = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require(`humanize-duration`)
var maintenance = require("../maintenance.json")

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
setInterval(function() {
    requireUncached("../maintenance.json")
}, 1000);

module.exports = {
    name: 'maintenance',
    aliases: [],
    ownerOnly: true,
    usage: `maintenance on`,
    description: 'Puts the bot into maintenance.',
    async execute(message, args, client) {
        if (message.author.id !== client.config.ownerID) return;
        const botPrefix = client.getPrefix(message.guild?.id)
        console.log(args.join(" "))
        if (!args[0]) {
            if (maintenance.status == false) {
                message.channel.send(`Maintenance is currently not activated.`)
            }
            if (maintenance.status == true) {
                message.channel.send(`Maintenance is ON! The planned duration is ${humanizeDuration(maintenance.duration)}`)
            }
        }
        if (args[0]) {
            switch (args[0]) {
                case `on`:

                    // code block
                    const channel = client.channels.cache.get('723990619415904326');
                    const rawTime = new Date()
                        .getTime();
                    if (!args[1]) args[1] = `1h`
                    if (!args[2]) args[2] = "The reason was not given by the Owner. Please try again later!"
                    var msTime = ms(args[1])
                    if (msTime = 0) msTime = `3600000`
                    const RAWoutputTime = rawTime + msTime;
                    const time = humanizeDuration(msTime)
                    args[0] = undefined
                    args[1] = undefined
                    const reason = args.join(" ")
                        .slice(2)
                    message.channel.send(`<:blobstop:701917476446929008> I have put ${client.user.tag} into **Maintenance** for a duration of ${time} AND have alerted the support server. <:blobstop:701917476446929008>`)
                    channel.send(`ETA: ${time}\nReason: ${reason}`)
                    break;
                case `off`:
                    if (maintenance.status == true) {
                        message.channel.send(`<:SeriousHappy:695319296078905434> ${client.user.tag} has been taken off of Maintenance! <:SeriousHappy:695319296078905434>`)
                    } else {
                        if (maintenance.status !== true) {
                            message.channel.send('' + client.user.tag + ' is NOT on Maintenance! Turn it on by running ``' + botPrefix + 'maintenance on``')
                        }
                    }
                    break;
                default:
                    const invalidUsage = new Discord.MessageEmbed()
                        .setColor('BLACK')
                        .setTitle("Definitely not a option.")
                        .setDescription(`Please use proper syntax.\nUsage:\n${botPrefix}maintenance on 1h Fixing servers!`)
                        .setTimestamp()
                        .setFooter("Square up, noob!");
                    return message.channel.send(`Invalid Syntax.`, invalidUsage)
            }
        }
    },
}