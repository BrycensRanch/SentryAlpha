const Discord = require('discord.js')
const fs = require("fs")
const axios = require("axios");
const path = require("path")
module.exports = {
    name: 'previewtiktok',
    aliases: [],
    cooldown: 2,
    usage: `previewtiktok`,
    description: 'Ping pong!',
    downloadImage: async function downloadTikTok(name, resp) {
        const filepath = path.resolve(__dirname, 'assets', name)
        const writer = fs.createWriteStream(filepath)
        resp.data.pipe(writer)
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    },
    async execute(message, args, client, flags) {
        const res = await axios.get(`https://www.tiktokdownloader.org/check.php?v=${args[0]}&t=${Date.now()}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
                "Referer": "https://www.google.com/",
                "Accept-Encoding": "gzip, deflate, br",
            }
        })
        console.log(res.data)
        if (res.data?.download_url) {
            const downloadUrl = res.data.download_url
            const response = await axios(downloadUrl, {
                responseType: 'stream',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
                    "Referer": "https://www.tiktokdownloader.org/",
                }
            })
            let headerLine = response.headers['content-disposition'];
            let startFileNameIndex = headerLine.indexOf('"') + 1
            let endFileNameIndex = headerLine.lastIndexOf('"');
            let filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
            await this.downloadImage(filename, response)
            const fp = path.resolve(__dirname, 'assets', filename)
            const attachment = new Discord.MessageAttachment(fp, filename);
            await message.channel.send(attachment)
            return fs.unlinkSync(fp)
        } else return;

        //message.channel.send(`This video is from ${user}! The video's description is ${videoMeta.collector[0].text}`)

    },
}