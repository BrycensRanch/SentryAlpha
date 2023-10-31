const Discord = require('discord.js')
const GuildsPlayinTTS = []
module.exports = {
    name: 'tts',
    aliases: [`text`, `tts`, `tt`],
    cooldown: 7,
    guildOnly: true,
    usage: `tts Sentry is amazing!`,
    description: 'Text to voice channel magic! **Note: This was tested when I didnt have my audio on..**',
    TTS: GuildsPlayinTTS,
    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('Please join a voice channel for me to use tts.')
        if (!args[0]) return message.channel.send('Please provide text for me to turn into speech!')
        if (GuildsPlayinTTS.includes(message.guild.id) && message.guild.me.voice.channel) return message.channel.send('Someone else in this server is already using TTS! Please try again later.')
        if (!voiceChannel.permissionsFor(message.guild.me)
            .serialize(false)
            .CONNECT) return message.channel.send(`Hey, I can't connect to ${voiceChannel.toString()}!`)
        if (args.join(` `)
            .length > 500) message.channel.send("Hey, that's a pretty long string you've got there! I'm gonna have to cut some of that off.")
        let msg = args.join(` `)
            .substr(0, 500)
            .replace(/^<@([^>]+)>$/gim, '')
        if (msg.length == 0) msg = 'Oh no, it seems your text to speech was kinda garbage. Please add text and not just a mention!'
        voiceChannel.join()
            .then(async connection => {
                try {
                    if (msg == 'im gay') {
                        msg = `We know, now shut up ${message.member.nickname || message.author.username}!`
                    }
                    message.guild.members.cache.get(client.user.id)
                        .voice.setSelfDeaf(true)
                    GuildsPlayinTTS.push(message.guild.id)

                    const dispatcher = await connection.play(`https://api.voicerss.org/?key=${client.config.commandKeys["tts-key"]}&hl=en-us&v=John&c=MP3&f=44khz_8bit_stereo&r=1&src=${encodeURIComponent(msg)}`)
                    dispatcher.on("finish", () => {
                        voiceChannel.leave()
                        const guildinArray = GuildsPlayinTTS.indexOf(message.guild.id)
                        delete GuildsPlayinTTS[guildinArray]
                    })
                } catch (e) {
                    const guildinArray = GuildsPlayinTTS.indexOf(message.guild.id)
                    delete GuildsPlayinTTS[guildinArray]
                    voiceChannel.leave()
                    return message.channel.send("There was a error! Maybe the command has been used too much today? Come back tomorrow I guess...")
                }
            })
            .catch(err => {
                const guildinArray = GuildsPlayinTTS.indexOf(message.guild.id)
                delete GuildsPlayinTTS[guildinArray]
                voiceChannel.leave()
                console.error(err)
                return message.channel.send(`I couldn't join \`${voiceChannel.name}\`! Are you sure I have the permissions to join that voice channel?`)
            });
    },
}