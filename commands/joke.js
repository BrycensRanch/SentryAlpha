const Discord = require('discord.js')
const axios = require(`axios`)
const blacklistedWords = ["towers", "lgbtq", "space shuttle", "bodies", "shootings", "africa"]
const Categories = [
	"Miscellaneous",
	"Programming",
	"Pun",
	"Spooky",
	"Christmas"
]
const reportBaseURL = "https://github.com/Sv443/JokeAPI/issues/new?assignees=Sv443&labels=%E2%9D%97+reported+joke&template=report-a-joke.md"
const reportTemplate = (response) => `&title=${encodeURIComponent("Reporting Joke ")}${response.data.id}`;
module.exports = {
    name: 'joke',
    aliases: [`dadjoke`, `dad`, `epicjoke`],
    cooldown: 6,
    usage: `joke`,
    description: 'Epic joke generator.',
    async execute(message, args, client) {
        async function getJoke() {
            const Category = Categories[Math.floor(Math.random() * Categories.length)];
            var apiResponse = null;
            await axios.get(`https://sv443.net/jokeapi/v2/joke/${Category}?blacklistFlags=racist,nsfw,political,religious,sexist`)
                .catch(() => {

                    return msg.edit(`:x: | There was an error contacting my joke machine.`)
                })
                .then(async function (response) {
                    return apiResponse = response;
                })
            return apiResponse;
        }
        const msg = await message.channel.send("Stealing epic jokes...")
        var response = await getJoke()
        if (response.data.joke && response.data.joke.toLowerCase()
            .indexOf(blacklistedWords)) response = await getJoke()
        if (response.data.setup && response.data.setup.toLowerCase()
            .indexOf(blacklistedWords)) response = await getJoke()
        const exampleEmbed = new Discord.MessageEmbed()
        exampleEmbed.setColor('RANDOM')
        exampleEmbed.setDescription(`Joke ID: ${response.data.id} Inappropriate response? [Let us know!](${reportBaseURL}${reportTemplate(response)})`)
        if (response.data.type == `twopart`) {
            msg.edit(`:question: | **${response.data.setup}**`)
            setTimeout(function () {
                msg.edit(`:question: | **${response.data.setup}**\n<:hah:717486777115607082> | *${response.data.delivery}*`, exampleEmbed)
            }, 6000);

        }
        if (response.data.type == `single`) {
            msg.edit(`<:hah:717486777115607082> | *${response.data.joke}*`, exampleEmbed)
        }
    },
}