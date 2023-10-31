const Discord = require('discord.js');

const Humanize = require(`humanize-plus`);
const endOfLine = require('os').EOL

function getAvatar(user) {
    let format = "png"
    format = user.avatar.startsWith('a_') ? 'gif' : format;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=4096`
}
const voucher_codes = require('voucher-code-generator');
const HumanizeVote = {
    boat: "Discord.Boats",
    vultrex: "discordbots.co",
    "top.gg": "Top.gg",
    bfd: "BotsForDiscord.com",
    space: "botlist.space",
    dbl: "discordbotlist.com",
    dlabs: "bots.discordlabs.org"
}

module.exports = async (client, vote) => {
    const {db, db2, logger} = client
    const alertChannel = client.channels.cache.get('782327695887433779')
    const botSpamChannel = client.channels.cache.get('714545192446853140')
    const vultrexGuild = client.guilds.cache.get(`638036514214772737`)
    const vultrexMembers = vultrexGuild.members.cache
    if (!alertChannel) return logger.error("Vote event is disabled because the alertChannel could not be resolved.")
    if (!vote) return logger.log('400, bad request. Lol.')
    if (!vote.Votetype) return logger.log('Unsupported vote.', vote)
    if (!vote.user) return logger.error("No user provided for this vote", vote)
    const voteID = voucher_codes.generate({
        prefix: `${vote.Votetype == "vultrex" && vote.type == "review" ? "REVIEW": vote.Votetype.toUpperCase()}-`,
        pattern: "####-####-####",
        charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }).toString()
    var voterUser = await client.users.fetch(vote.user).catch(() => null)
    let role = alertChannel.guild.roles.cache.find(role => role.id === "782502074700005387");
    if (role && alertChannel.guild.members.cache.has(vote.user)) alertChannel.guild.members.cache.get(vote.user).roles.add(role).catch(() => null);
    let addVote = db2.prepare(`INSERT INTO "votes" VALUES(?,?,?,?)`);
    const amountToGive = vote.Votetype == "top.gg" && vote.isWeekend || vote.Votetype == "vultrex" || vote.Votetype == "space" ? client.randomNumber(100, 1000) : client.randomNumber(50, 750)
    if (vote.type !== "test") {
    client.getBal(vote.user).then(async addMoney => {
        if (!addMoney || addMoney && addMoney.balance !== "Infinity") {
            await client.setBal(vote.user, addMoney ? parseInt(addMoney.balance) + amountToGive : client.config.defaultMoney + amountToGive)
        }
        client.setEcoLog(vote.user, amountToGive, `Voting/feedback benefits for [**${HumanizeVote[vote.Votetype] || vote.Votetype}**](${voteID.startsWith("REVIEW") ? `https://${HumanizeVote[vote.Votetype]}/` : `https://dash.sentry.best/vote/${voteID}` }).`)
    })
}
    switch (vote.Votetype) {
        case 'top.gg':
            const vote_Embed1 = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : "https://top.gg/images/logoinverted.png"}`)
                .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you Unknown user ${vote.user}! Maybe one day I'll see your face.`}\n\nIf you haven't voted already, **[Click here](https://top.gg/bot/707490338289352725/vote)** and make sure you're logged in.`)
                .setTimestamp()
                .setFooter(`Vote ID: ${voteID}`);
            alertChannel.send(`${vote.isWeekend ? "<:double:776907190523002920> | Double Vote" : "<:ivoted:773006580035747882> | New vote"} from top.gg! Epic, thank you <@${vote.user}> for voting!`, vote_Embed1)
            if (vote.type !== "test") {
                addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `top.gg`);
                addVote.finalize();
            }
            break;
        case 'bfd':
            const vote_Embed2 = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : "https://botsfordiscord.com/favicon.ico"}`)
                .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}! (${voterUser.id})`: `Thank you Unknown user ${vote.user}! Maybe one day I'll see your face.`}\n\nIf you haven't voted already, **[Click here](https://botsfordiscord.com/bot/707490338289352725/vote)** and make sure you're logged in.`)
                .setTimestamp()
                .setFooter(`Vote ID: ${voteID}`);
            alertChannel.send(`<:ivoted:773006580035747882> | New vote from BotsForDiscord.com! Epic, thank you <@${vote.user}> for voting!`, vote_Embed2)

            if (vote.type !== "test") {
                addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `bfd`);
                addVote.finalize();
            }
            break;
        case 'space':

            const vote_Embed3 = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : getAvatar(vote.userObj)}`)
                .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you ${vote.userObj.username}#${vote.userObj.discriminator} (${vote.userObj.id})! Maybe one day I'll see your face in one of my servers.`}\n\nIf you haven't voted already, **[Click here](https://botlist.space/bot/707490338289352725/upvote)** and make sure you're logged in.`)
                .setTimestamp()
                .setFooter(`Vote ID: ${voteID}`);
            alertChannel.send(`<:ivoted:773006580035747882> | New vote from botlist.space! Epic, thank you <@${vote.user}> for voting!`, vote_Embed3)

            addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `space`);
            addVote.finalize();
            break;
        case 'boat':
            const vote_Embed4 = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : getAvatar(vote.userObj)}`)
                .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you ${vote.userObj.username}#${vote.userObj.discriminator} (${vote.userObj.id})! Maybe one day I'll see your face in one of my servers.`}\n\nIf you haven't voted already, **[Click here](https://discord.boats/bot/707490338289352725/vote)** and make sure you're logged in.`)
                .setTimestamp()
                .setFooter(`Vote ID: ${voteID}`);
            alertChannel.send(`<:ivoted:773006580035747882> | New vote from discord.boats! Epic, thank you <@${vote.userObj.id}> for voting!`, vote_Embed4)


            addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `boat`);
            addVote.finalize();
            break;
        case 'dbl':
            const vote_Embed5 = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : getAvatar(vote.userObj)}`)
                .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you ${vote.userObj.admin ? "DBL Site Admin " : ""}${vote.userObj.username}#${vote.userObj.discriminator} (${vote.userObj.id})! Maybe one day I'll see your face in one of my servers.`}\n\nIf you haven't voted already, **[Click here](https://discordbotlist.com/bots/sentry-alpha)** and make sure you're logged in.`)
                .setTimestamp()
                .setFooter(`Vote ID: ${voteID}`);
            alertChannel.send(`<:ivoted:773006580035747882> | New vote from discordbotlist.com! Epic, thank you <@${vote.user}> for voting!`, vote_Embed5)

            addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `dbl`);
            addVote.finalize();
            break;
        case 'vultrex':
            if (vote.type == "vote") {
                const vote_Embed6 = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : "https://discordbots.co/favicon.png"}`)
                    .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you Unknown user ${vote.user}! Maybe one day I'll see your face.`}\n\nIf you haven't voted already, **[Click here](https://discordbots.co/bot/sentry-alpha)** and make sure you're logged in.`)
                    .setTimestamp()
                    .setFooter(`Vote ID: ${voteID}`);
                alertChannel.send(`<:ivoted:773006580035747882> | New vote from discordbots.co! Epic, thank you <@${vote.user}> for voting!`, vote_Embed6)
                botSpamChannel.send(`<:ivoted:773006580035747882> | Ay ${vultrexMembers.random().displayName}, a dickhead has voted for Sentry Alpha! Epic, thank you ${vultrexMembers.has(vote.user) ? `${vultrexMembers.get(vote.user).displayName}!`: `<@${vote.user}> for voting!`}`, vote_Embed6)

                addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), `vultrex`);
                addVote.finalize();
                break;
            } else if (vote.type == "review") {
                vote.rawContent = []
                vote.review.split(endOfLine)
                    .forEach(line => {
                        vote.rawContent.push(`> ${line}`)
                    })
                const vote_Embed6 = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : "https://discordbots.co/favicon.png"}`)
                    .setDescription(`Thank you for leaving an review for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you Unknown user ${vote.user}! Maybe one day I'll see your face.`}\nReview Feedback:\n${vote.positive ? "Positive, they liked the bot!" : "Negative, they disliked the bot. ;("}`)
                    .addField("Review Content", `${vote.rawContent.join("\n")}`)
                    .addField("Review Link", `**[Click here](https://discordbots.co/bot/sentry-alpha)** to view the review or leave an review.`)
                    .setTimestamp()
                    .setFooter(`Review ID: ${voteID} (wont save)`);
                alertChannel.send(`<:emoji_27:620492300384075778> | New review from discordbots.co! Epic, thank you <@${vote.user}> for leaving an review! You should see an reward in your balance soon.`, vote_Embed6)
                botSpamChannel.send(`<:emoji_27:620492300384075778> | Ay ${vultrexMembers.random().displayName}, a dickhead has left an review for Sentry Alpha! Epic, thank you ${vultrexMembers.has(vote.user) ? `${vultrexMembers.get(vote.user).displayName}`: `<@${vote.user}>`} for leaving a fucking review. To view it,.`, vote_Embed6)
                break;
            }
            case 'dlabs':
                const vote_Embed6 = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${client.user.tag} Voting System `, `${voterUser ? voterUser.displayAvatarURL({size: 4096, format: "png", dynamic: true}) : "https://cdn.discordapp.com/icons/608711879858192479/a_d25bd6131772dd5f7018ffb8951f115c.gif?size=4096"}`)
                    .setDescription(`Thank you for voting for ${client.user.username}, ${voterUser ? `${voterUser.tag}`: `Thank you ${vote.userObj.username}#${vote.userObj.discriminator} (${vote.userObj.id})! Maybe one day I'll see your face in one of my servers.`}\n\nIf you haven't voted already, **[Click here](https://bots.discordlabs.org/bot/707490338289352725?vote)** and make sure you're logged in.`)
                    .setTimestamp()
                    .setFooter(`Vote ID: ${voteID}`);
                alertChannel.send(`<:ivoted:773006580035747882> | New vote from bots.discordlabs.org! Epic, thank you <@${vote.user}> for voting!`, vote_Embed6)

                if (!vote.test) {
                    addVote.run(`${voteID}`, `${vote.user}`, new Date().getTime(), vote.Votetype);
                    addVote.finalize();
                }
                break;
            default:
                return logger.error(`Unknown vote.\n`, vote)
    }
}; //vote.user