const Discord = require('discord.js')
const axios = require("axios")
const path = require("path")
const fs = require("fs")
module.exports = {
    name: 'TikTok Preview',
    cooldown: 2,
    usage: `https://vm.tiktok.com/ZMdujUoPV/`,
    description: 'Generates a preview/video of a linked TikTok',
    async downloadTikTok(name, resp) {
        const filepath = path.resolve(process.cwd(), 'commands', 'assets' , name)
        const writer = fs.createWriteStream(filepath)
        resp.data.pipe(writer)
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
    },
    regex: new RegExp(/https?:\/\/vm.tiktok.com\/.+[\w]|https:\/\/www.tiktok.com\/@.+[\w]\/video\/.+[\w]/),
    async execute(message, client) {
        const matchedLink = message.content.match(this.regex)[0]
        const res = await axios.get(`https://www.tiktokdownloader.org/check.php?v=${matchedLink}&t=${Date.now()}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
                "Referer": "https://www.google.com/",
                "Accept-Encoding": "gzip, deflate, br",
            }
        })
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
            await this.downloadTikTok(filename, response)
            const fp = path.resolve(process.cwd(), 'commands', 'assets' , filename)

                const attachment = new Discord.MessageAttachment(fp, filename);
                await message.channel.send(attachment).then(() => {
                    fs.unlinkSync(fp)
                })
                .catch(() => null);
        }
        //else return;
    },
}