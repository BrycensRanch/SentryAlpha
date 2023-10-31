const {
    MessageAttachment
} = require('discord.js');
const Canvacord = require("canvacord");
module.exports = async (client, member) => {
    if (member.guild.id !== `557529166644510731`) return;
    if (member.bot == true) return;
    const channel = member.guild.channels.cache.find(ch => ch.id === '723990618430505002');
    if (!channel) return;

    const Memberrole = member.guild.roles.cache.find(r => r.id === "723990611316834396");

    //adds the role
    member.roles.add(Memberrole).catch(() => null);
    let image = await Canvacord.Canvas.welcome({
        username: member.user.username,
        discrim: member.user.discriminator,
        avatarURL: `${member.user.displayAvatarURL({dynamic: false, format: `png`, size: 4096})}`
    });
    let attachment = new MessageAttachment(image, "welcome.png");
    channel.send(`Welcome to \`\`${member.guild.name}\`\`, <@${member.user.id}>! This is the central server for all of Romvnly's projects. I am Sentry Alpha bot, coded by Romvnly and I can do a lot of really coolio stuff. You better have a good experience or else, mate. You don't wanna know what bots can do when their angry. :)\nAnyways, enjoy the community!`, attachment, {
        disableMentions: "everyone",
        spilt: true
    }).catch(err => {
        console.log(`Oh no, I don't have the permissions to send the welcome message!`)
    })
};