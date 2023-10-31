const Discord = require('discord.js')
const fs = require('fs');
module.exports = {
    name: 'tiktok',
    aliases: [],
    cooldown: 10,
    usage: `tiktok`,
    botPerms: ["ADD_REACTIONS", "ATTACH_FILES"],
    description: 'Tiktoks. Meh.',
    async execute(message, args, client) {
        const tikToks = fs.readdirSync('./tiktok')
            .filter(file => file.endsWith('.mp4'));
        const response = tikToks[Math.floor(Math.random() * tikToks.length)];
        var tiktokName = response.slice(0, -4)
        var meme = client.db2.prepare(`SELECT * FROM "tiktok" WHERE meme = ?`)
            .get(tiktokName);
        if (!meme) {
            var meme = {
                meme: tiktokName,
                "upvotes": 0,
                "downvotes": 0
            }
        }

        function sub(channel, emoji1, emoji2) {
            if (channel.guild) {
                return channel.permissionsFor(message.guild.me)
                    .serialize()
                    .USE_EXTERNAL_EMOJIS ? emoji1 : emoji2
            } else {
                return emoji1;
            }
        }
        const attachment = new Discord.MessageAttachment(`./tiktok/${response}`, `${response}`);
        message.channel.startTyping()

        const memeMsg = await message.channel.send(`📺 | Tiktok System: \`${response}\`\nEpic meme, am I rite?\n**Upvote System** 📥\n\n\`Upvotes: ${meme.upvotes || 0}\nDownvotes: ${meme.downvotes || 0}\``, attachment)
            .catch(err => {
                return message.channel.send(`Oh no, a error occured with my meme machine. Come back later when you have the chance!`)
            })
        message.channel.stopTyping()
        if (!memeMsg.channel) return;
        const msg = await message.channel.send(`If ${message.guild ? "you or your friends" : "you"} would like to upvote this meme, now's the time! You have 2 minutes.`)

        memeMsg.react(`${sub(message.channel, "621115141248909332", "👍")}`)
            .then(async r => {
                memeMsg.react("💩")
                const FeedbackArray = [];
                if (meme.upvotes == 0 && meme.downvotes == 0) {
                    var insertfeedback = client.db2.prepare(`INSERT INTO "tiktok" VALUES(?,?,?)`);
                }
                if (meme.upvotes !== 0 || meme.downvotes !== 0) {
                    var insertfeedback = client.db2.prepare(`UPDATE tiktok SET meme = ?, upvotes = ?, downvotes = ? WHERE meme = "${meme.meme}"`);
                }
                if (!message.guild || message.channel.permissionsFor(message.guild.me)
                    .serialize()
                    .ADD_REACTIONS) {
                    //Filters - These  make sure the variables are correct before running a part of code
                    const upvoteFilter = (reaction, user) => reaction.emoji.id === `${r.emoji.id}` && !FeedbackArray.includes(user.id) && !user.bot
                    const downvoteFilter = (reaction, user) => reaction.emoji.name === "💩" && !FeedbackArray.includes(user.id) && !user.bot

                    const upvote = memeMsg.createReactionCollector(upvoteFilter, {
                        time: 120000
                    });
                    const downvote = memeMsg.createReactionCollector(downvoteFilter, {
                        time: 120000
                    });
                    upvote.on("collect", (r, user) => {
                        meme.upvotes = meme.upvotes + 1
                        var upvote = meme.upvotes
                        insertfeedback.run(tiktokName, upvote, meme.downvotes)
                        memeMsg.edit(`📺 | Tiktok System: \`${response}\`\nEpic meme, am I rite?\n**Upvote System** 📥\n\n\`Upvotes: ${upvote || 0}\nDownvotes: ${meme.downvotes || 0}\``)
                        FeedbackArray.push(user.id)
                        message.channel.send(`${user.toString()}, you reacted with ${r.emoji.toString()}! Thank you for the feedback on \`${response}\`. Your vote is saved on this meme.`)
                            .catch(() => null);
                    })
                    downvote.on("collect", (r, user) => {
                        meme.downvotes = meme.downvotes + 1
                        var downvote = meme.downvotes
                        insertfeedback.run(tiktokName, meme.upvotes, downvote)
                        memeMsg.edit(`📺 | Tiktok System: \`${response}\`\nEpic meme, am I rite?\n**Upvote System** 📥\n\n\`Upvotes: ${meme.upvotes || 0}\nDownvotes: ${downvote || 0}\``)
                        FeedbackArray.push(user.id)
                        message.channel.send(`${user.toString()}, you reacted with ${r.emoji.toString()}! Thank you for the feedback on \`${response}\`. Your vote is saved on this meme.`)
                            .catch(() => null);
                    })
                } else {
                    const filter = m => m.author.id === message.author.id
                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 200000,
                            errors: ['time']
                        })
                        .then(async collected => {
                            msg.delete()
                                .catch(() => null);
                            if (collected.first()
                                .content.toLowerCase() == `downvote` || collected.first()
                                .content.toLowerCase() == `upvote`) {
                                if (meme.upvotes == 0 && meme.downvotes == 0) {
                                    var insertfeedback = client.db2.prepare(`INSERT INTO "tiktok" VALUES(?,?,?)`);
                                }
                                if (meme.upvotes !== 0 || meme.downvotes !== 0) {
                                    var insertfeedback = client.db2.prepare(`UPDATE tiktok SET meme = ?, upvotes = ?, downvotes = ? WHERE meme = "${meme.meme}"`);
                                }
                                if (collected.first()
                                    .content.toLowerCase() == `downvote`) {
                                    var downvote = meme.downvotes + 1
                                    insertfeedback.run(tiktokName, meme.upvotes, downvote)
                                    memeMsg.edit(`📺 | Tiktok System: \`${response}\`\nEpic meme, am I rite?\n**Upvote System** 📥\n\n\`Upvotes: ${meme.upvotes || 0}\nDownvotes: ${meme.downvotes || 0}\``)
                                }
                                if (collected.first()
                                    .content.toLowerCase() == `upvote`) {
                                    var upvote = meme.upvotes + 1
                                    insertfeedback.run(tiktokName, upvote, meme.downvotes)
                                    memeMsg.edit(`📺 | Tiktok System: \`${response}\`\nEpic meme, am I rite?\n**Upvote System** 📥\n\n\`Upvotes: ${upvote || 0}\nDownvotes: ${meme.downvotes || 0}\``)
                                }
                                const thx = await message.channel.send(`Thank you for the feedback on \`${response}\`. Your vote is saved on this meme.`)
                                    .catch(() => null);
                                setTimeout(function () {
                                    thx.delete()
                                        .catch(err => {
                                            return;
                                        })
                                    collected.first()
                                        .delete()
                                        .catch(err => {
                                            return;
                                        })
                                }, 5000);
                            }
                        })
                        .catch(collected => {
                            msg.delete()
                                .catch(err => {
                                    return;
                                })
                        })
                }
            })
    },
}