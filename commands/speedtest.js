const Discord = require('discord.js')
var fs = require('fs');
const {
    default: convertSize
} = require("convert-size");
const speedTest = require('speedtest-net');
module.exports = {
    name: 'speedtest',
    aliases: [`vroom`, `speedy`],
    ownerOnly: true,
    description: 'Check network stats command.',
    async execute(message, args, client) {
        const initalMsg = await message.channel.send(':stopwatch: **Running speedtest. This may take a while!** :stopwatch:')
        message.channel.startTyping()
        const results = await speedTest({
            acceptGdpr: true,
            acceptLicense: true,
            serverId: 15811
        })

        const rawdownload = results.download.bandwidth / 100000
        const rawupload = results.upload.bandwidth / 100000
        const rawping = results.ping.latency
        const download = Math.round(rawdownload)
        const upload = Math.round(rawupload)
        const ping = Math.round(rawping)
        const BytesUsedDownload = convertSize(results.download.bytes, {
            accuracy: 2
        });
        const BytesUsedUpload = convertSize(results.upload.bytes, {
            accuracy: 2
        });
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Speedtest.net results')
            .setURL('https://speedtest.net')
            .setThumbnail('https://img.findmysoft.com/ico/134611.jpg')
            .addFields({
                name: '🔗 Download',
                value: `**${download}** mbps`,
                inline: true
            }, {
                name: '📩Upload',
                value: `**${upload}** mbps`,
                inline: true
            }, {
                name: '🚄Ping',
                value: `**${ping}** ms`,
                inline: true
            }, )
            .setDescription(`Bandwidth Used: ${BytesUsedDownload} for download, ${BytesUsedUpload} for upload.`)
            .setTimestamp()
            .setFooter(`Server ID: ${results.server.name} ${results.server.location} (${results.server.id})`);
        await initalMsg.edit(`Test completed! Here are your results!`, exampleEmbed)


        var outputFilename = './speedtest.json';
        const resultz = {
            "download": download,
            "upload": upload,
            "ping": ping
        }

        client.speedtest = resultz

        message.channel.stopTyping({
            force: true
        })
    },
}