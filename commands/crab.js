const Discord = require('discord.js')
const system = require('system-commands')
const fs = require('fs');
system('ffmpeg -v')
    .catch((output) => {
        if (!output.includes("ffmpeg version")) throw new Error(`FFMPEG is not installed on your system for the crab command, do sudo apt update && sudo apt install ffmpeg`);
    })
module.exports = {
    name: 'crab',
    aliases: [`holycrab`, `crabby`],
    cooldown: 15,
    guildOnly: true,
    usage: `crab Mr Krabs is GONE`,
    description: 'Generates a crab rave meme.',
    async execute(message, args, client) {
        if (!args[0]) return message.channel.send('Hey, give me some text that I can display!')
        if (args.join(" ")
            .match(/"(?:[^"\\]|\\.)*"/)) return message.channel.send("The provided string may not contain quotes.")
        const txt = args.join(" ")
        try {
            const outputFileName = client.utils.cryptoRandomString(20) + ".mp4";
            message.channel.startTyping()
            await system('ffmpeg -hwaccel auto -i "' + process.env.PWD + '/commands/assets/input.mp4" -crf 37 -vf drawtext="' + process.env.PWD + '/Modeseven-L3n5.ttf: text=' + txt.trim() + ': fontsize=36:fontcolor=white:  x=(w-text_w)/2: y=(h-text_h)/2" -y -codec:a copy "' + process.env.PWD + '/commands/assets/' + outputFileName + '"')
                .then(async results => {
                    const attachment = new Discord.MessageAttachment(`./commands/assets/${outputFileName}`, `${txt.substr(0, 10)}.mp4`);
                    await message.channel.send(attachment)
                    message.channel.stopTyping()
                    fs.unlinkSync(`./commands/assets/${outputFileName}`)
                })
        } catch (e) {
            message.channel.stopTyping({
                force: true
            })
            message.channel.send(`Oh no, a error!`)
            console.error(e)
        }
    },
}