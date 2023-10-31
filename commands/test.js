const Discord = require('discord.js')

module.exports = {
    name: 'test',
    aliases: [],
    description: 'Command for testing, development, etc.',
    ownerOnly: true,
    async execute(message, args, client) {
        console.log(message.content.startsWith(`<@!387062216030945281>`))
        message.channel.send(`  <:roblox:707123532584452146> **Roblox Group**: https://www.roblox.com/groups/5396776/The-Graceful-Bloodline#!/about <:roblox:707123532584452146>

<:HONOR:707124156323463188> **Honor Warrior Group**: https://www.roblox.com/groups/5543371/The-Graceful-Honor-Warriors#!/about <:HONOR:707124156323463188>
<:HONOR:707124156323463188> **Honor Warrior Discord**: https://discord.gg/f7GT3Dt :HONOR: 
:handshake:  **Recruitment Server**: https://discord.gg/39Qe674 :incoming_envelope: 
:notebook_with_decorative_cover: **Codex**: https://sites.google.com/view/the-graceful-codex/home

<:OfficialLogo:707123612594864198> **Graceful Uniforms (+)**:   https://www.roblox.com/library/4823664515/The-Graceful-Robes?rbxp=112826892 <:OfficialLogo:707123612594864198>
<:OfficialLogo:707123612594864198> **Graceful Uniform (-)**:  https://www.roblox.com/library/4823665188/The-Graceful-Robes?rbxp=112826892 <:OfficialLogo:707123612594864198>

**MADE BY OUR ALLIES, ARASHI!**
:crossed_swords: **Combat Guide**: https://docs.google.com/document/d/1CM_Vjwj9U2pVEDTggD5Zr8gs1wAxJ9xuHFFSE9mSdgM/edit?usp=sharing :crossed_swords:

<:OfficialLogo:707123612594864198>   __***OFFICIAL BLOODLINE YOUTUBE:***__ https://bit.ly/Graceful_YouTube `)
    },
}