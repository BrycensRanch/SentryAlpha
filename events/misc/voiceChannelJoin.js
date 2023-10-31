const Discord = require('discord.js');
const fs = require('fs');
const tts = true

const GuildVoiceSounds = []

module.exports = async (client, member, channel) => {
    return;
    if (GuildVoiceSounds.includes(channel.guild.id)) return;
    if (member.user.bot == true) return;
    if (tts == true) {
        let msg = `${member.nickname || member.user.username} has joined the channel!`
        channel.join()
            .then(async connection => {
                channel.guild.members.cache.get(client.user.id)
                    .voice.setSelfDeaf(true)
                const dispatcher = await connection.play(`https://api.voicerss.org/?key=${client.config["tts-key"]}&hl=en-us&v=John&c=MP3&f=44khz_8bit_stereo&r=1&src=${encodeURIComponent(msg)}`);
                dispatcher.on("finish", () => {
                    channel.leave()
                    const guildinArray = GuildVoiceSounds.indexOf(channel.guild.id)
                    delete GuildVoiceSounds[guildinArray]
                })
            })
            .catch(err => {
                const guildinArray = GuildVoiceSounds.indexOf(channel.guild.id)
                delete GuildVoiceSounds[guildinArray]
                return channel.leave()
            });
    }
    if (tts == false) {

        const SoundsFiles = fs.readdirSync('./Sounds')
            .filter(file => file.endsWith('.mp3'));
        const file = SoundsFiles[Math.floor(Math.random() * SoundsFiles.length)];
        channel.join()
            .then(async connection => {
                channel.guild.members.cache.get(client.user.id)
                    .voice.setSelfDeaf(true)
                const dispatcher = await connection.play(`./Sounds/${file}`);
                dispatcher.on("finish", () => {
                    client.on("voiceChannelLeave", (VCMember, VCCHANNEL) => {
                        if (VCMember.user.id == member.user.id) {
                            const guildinArray = GuildVoiceSounds.indexOf(VCCHANNEL.guild.id)
                            delete GuildVoiceSounds[guildinArray]
                            return channel.leave()
                        }
                    });
                    channel.leave()
                    const guildinArray = GuildVoiceSounds.indexOf(channel.guild.id)
                    return delete GuildVoiceSounds[guildinArray]
                })
            })
            .catch(err => {
                channel.leave()
                const guildinArray = GuildVoiceSounds.indexOf(channel.guild.id)
                return delete GuildVoiceSounds[guildinArray]
            });
    }
};