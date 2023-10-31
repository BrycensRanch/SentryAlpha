const Discord = require('discord.js')
const axios = require("axios");
const path = require("path")
const randomPuppy = async function randomPuppy(client, subreddit) {
    var meme;
    await axios.get(`https://api.snowflakedev.cf/api/meme?sbr=${subreddit}`, { // If it fails, it'll be ok.
            headers: {
                'User-Agent': `Memes`,
                "Content-Type": "application/json",
                "Authorization": client.config.commandKeys["snowflake"]
            },
            timeout: 2000
        })
        .then(res => {
            meme = res.data
        })
        .catch(() => console.error)
    return meme;
}
module.exports = {
    name: 'meme',
    aliases: [`fatmeme`, `dankmeme`, `ultrameme`],
    cooldown: 5,
    usage: `meme`,
    description: 'Hot memes!',
    Ready: true,
    async execute(message, args, client) {
        const subReddits = ['dankmeme', 'meme', 'dankmemes', 'memes', 'laugh', 'funny', 'me_irl', 'MemeEconomy', 'HistoryMemes', 'SequelMemes', 'MinecraftMemes']
        const reddit = subReddits[Math.floor(Math.random() * subReddits.length)];
        const choices = ["Funni memes detected", "I compeltely agree with dis meme", "BIG MEMES!", "@God you see dis? DIS FUNNY", "Dont be a skrub by not laughing at this", "Snowflakes will not like dis one."]
        const response = choices[Math.floor(Math.random() * choices.length)];
        var meme = await randomPuppy(client, reddit)
        var retries = 10;
        if (!meme) {
            return message.reply(":x: | Failed to fetch the memes...")
        }
        if (meme.isVideo || meme.nsfw || meme.link == meme.url || !path.extname(meme.url)) {
            if (!retries || retries == 0) return message.channel.send(":x: | Oops it seems like there was an ERROR!")
            retries--;
            meme = await randomPuppy(client, reddit)
        }
        console.log(meme)
        const exampleEmbed = new Discord.MessageEmbed()
        exampleEmbed.setColor('RANDOM')

        if (message.guild) exampleEmbed.setAuthor(`${message.member.nickname || message.author.username}`, message.author.avatarURL({
            dynamic: true
        }))
        if (!message.guild) exampleEmbed.setAuthor(`${client.user.username}`, client.user.avatarURL({
            dynamic: true
        }))
        exampleEmbed.setTitle(meme.title)
        exampleEmbed.setTimestamp()
        exampleEmbed.setURL(meme.link)
        exampleEmbed.setImage(meme.url)
        exampleEmbed.setFooter(`🤠  | ${meme.ratings.upvote} upvotes`)
        message.channel.send(`${response}`, exampleEmbed)
    },
}