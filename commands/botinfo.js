var os = require('os');
const Discord = require('discord.js');
const ms = require(`ms`);
const {
    utc
} = require(`moment`);
const humanizeDuration = require("humanize-duration");
const osu = require('node-os-utils');
const {
    default: convertSize
} = require("convert-size");
const axios = require('axios')
module.exports = {
    name: 'botinfo',
    cooldown: 20,
    Ready: true,
    aliases: [`epicinfo`, `info`, `uptime`],
    description: 'Check botinfo command.',
    async execute(message, args, client, flags) {
        console.log("I AM BEING RUN")
        const version = client.package.version;
        const djsversion = Discord.version;
        const clientUptimeRAW = Math.round(client.uptime)
        const rawUptime = Math.round(process.uptime())
        const aaaa = ms(`${rawUptime}s`)
        const botUptime = humanizeDuration(aaaa);
        const core = os.cpus()[0]
        var mem = osu.mem
        mem.info()
            .then(info => {
                const totalRamRAW = convertSize(`${info.totalMemMb} MB`, {
                    accuracy: 1
                })
                const totalRam = convertSize(totalRamRAW, {
                    accuracy: 1
                });
                const usedRamRAW = convertSize(`${info.usedMemMb} MB`, {
                    accuracy: 2
                })
                const usedRam = convertSize(usedRamRAW, {
                    accuracy: 2
                });
                const ramLeftRAW = convertSize(`${info.freeMemMb} MB`)
                const ramLeft = convertSize(ramLeftRAW, {
                    accuracy: 2
                });
                const ramLeftPercentage = Math.round(info.freeMemPercentage)
                const cpuSpeedRAW = convertSize(`${core.speed} MB`)
                const cpuSpeedRAW2 = convertSize(cpuSpeedRAW * 1000000).slice(0, 5)
                const cpuSpeed = Math.round(cpuSpeedRAW2 * 100) / 100
                osu.cpu.usage()

                    .then(async response => {
                        const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(':books: **Bot Information** :book:')
                            .setAuthor(`${client.user.tag} (${client.user.id})`, client.user.avatarURL({
                                "dynamic": true
                            }))
                            .addFields(
                            {
                                name: 'Startup Time:',
                                value: `${humanizeDuration(ms(`${Math.round(process.uptime())}s`) - client.uptime, {round: true})}`,
                                inline: true
                            },
                            {
                                name: 'Bot Uptime:',
                                value: `${botUptime}`,
                                inline: true
                            },
                            {
                                name: 'Commands:',
                                value: `${client.commands.size}`,
                                inline: true
                            },
                            {
                                name: 'Servers:',
                                value: `${client.guilds.cache.size}`,
                                inline: true
                            },
                            {
                                name: 'Users:',
                                value: `${client.users.cache.size}`,
                                inline: true
                            },
                            {
                                name: 'Creation Date:',
                                value: `${utc(client.user.createdTimestamp).local().format(`MM-DD-YYYY HH:MM:SS A`)}`,
                                inline: true
                            },
                            {
                                name: 'Node.js Version:',
                                value: `${process.version}`,
                                inline: true
                            },
                            {
                                name: 'Discord.js Version:',
                                value: `v${djsversion}`,
                                inline: true
                            },
                            {
                                name: `${client.user.tag} Version:`,
                                value: `v${version}`,
                                inline: true
                            },
                            {
                                name: '\u200B',
                                value: '\u200B'
                            },
                            {
                                name: '🎮**System Info** 💻',
                                value: `Info about the system ${os.hostname()} running **${client.user.username}**!`
                            },
                            {
                                name: 'Platform:',
                                value: `${process.platform.capitalize()}`,
                                inline: true
                            }, )
                        if (client.botAdmins.includes(message.author.id)) {
                            // SentryAlpha is not hosted anymore on Hostingbot. 😔
                            // const VPS = await axios.get(`https://node2.hostingbot.net:4083/index.php?act=bandwidth&svs=458&api=json&apikey=${client.config.hostingbot["apiKey"]}&apipass=${client.config.hostingbot["apiPass"]}`)
                            // if (VPS.data.act == "login") throw new Error("The API request failed.")
                            //         const usedBandwidth = convertSize(`${VPS.data.bandwidth.used_gb} GB`, "GB", {
                            //             stringify: true,
                            //             accuracy: 2
                            //         })
                            //         const totalBandwidth = convertSize(`${VPS.data.bandwidth.limit_gb} GB`, "TB", {
                            //             stringify: true,
                            //             accuracy: 1
                            //         })
                            //         const usedBandwidthPercentage = VPS.data.bandwidth.percent
                            //         const bandwidthLeftPercentage = VPS.data.bandwidth.percent_free
                            //         exampleEmbed.addFields(
                            //         {
                            //             name: 'Bandwidth:',
                            //             value: `Currently, ${client.user.tag} has used **${usedBandwidth}** of it's __${totalBandwidth}__ of bandwidth. So, we currently have used **${usedBandwidthPercentage}**% of our bandwidth and only have **${bandwidthLeftPercentage}**% left.`,
                            //             inline: false
                            //         })
                        }
                        if (client.speedtest.download) {
                            exampleEmbed.addFields(
                            {
                                name: 'Network:',
                                value: `The last speedtest results were as follows: **${client.speedtest.download}** download, **${client.speedtest.upload}** upload, and **${client.speedtest.ping}** ping.`,
                                inline: false
                            })
                        }
                        if (!client.speedtest.download) {
                            exampleEmbed.addField(`Network:`, `There has been no recent speedtest!`)
                        }
                        exampleEmbed.addFields(
                            {
                                name: 'Host Runtime:',
                                value: `${humanizeDuration(ms(`${os.uptime}s`))}.`,
                                inline: true
                            },
                            {
                                name: '**CPU**:',
                                value: `The CPU percent is currently at **${response}%** (You shouldn't worry!)\nThe ${core.model} has ${os.cpus().length} cores and is running at the speed of **${cpuSpeed}GHz** `,
                                inline: false
                            },

                            {
                                name: '**Memory:**',
                                value: `Ram Total is **${totalRam}**. The system has used **${usedRam}** of it's RAM already. It has **${ramLeft}** left. Essentially, it has **${ramLeftPercentage}%** of it's ram left.`,
                                inline: false
                            },
                            {
                                name: '**Owners:**',
                                value: `${client.users.cache.get(client.config.ownerID).tag} (<@${client.config.ownerID}>)`,
                                inline: false
                            },
                        )
                        exampleEmbed.setTimestamp()
                        exampleEmbed.setFooter('Some epic information here.');
                        await message.channel.send(exampleEmbed)
                    })
            })
    },
}