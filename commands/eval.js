const Discord = require('discord.js')
const { inspect } = require(`util`);
const { stripIndents } = require(`common-tags`);
const fs = require('fs');
const axios = require("axios");
const system = require('system-commands');
const speedTest = require('speedtest-net');
const Canvas = require("canvas");
const canvacord = require("canvacord");
const ms = require(`ms`)
const moment = require('moment')
// Console colors
const colors = require('colors');
const logger = require('../logger.js');
const PasteGG = require("paste.gg");
const pasteGG = new PasteGG()
function serialize(obj) {
    if (typeof obj !== "object") throw new TypeError(`Not the correct type. Got a ${typeof obj} instead of a object.`); 
    for (const [key, value] of Object.entries(obj)) {
      if(obj[key] == "false") obj[key] = false;
      if (obj[key] == "true") obj[key] = true;
      if (obj[key] === 1) obj[key] = true;
      if (obj[key] === 0) obj[key] = false;
    }
  return obj;
}
module.exports = {
	name: 'eval',
	aliases: [`evaluate`, `run`],
    cooldown: 2,
    ownerOnly: true,
    Ready: true,
    usage: `eval message.author.id`,
	description: 'Evaluate/Run Javascript Code!',
	async execute(message, args, client, flags, parsedArgs) {
        async function post(text) {
            const post = await pasteGG.post({
                name: "JavaScript Evaluation", // Optional
                description: `Evaulation of amazing code from ${message.author.tag}`, // Optional
                expires: new Date(Date.now() + this.cooldown * 1000), // Optional
                files: [{
                name: "evaluation.txt",
                  content: {
                    format: "text",
                    value: text
                  }
                }]
              })
              return post.result.url;
        }
                let {db: database} = client;
                let {db2: data} = client;
                const Utils = client.utils;
                const code = args.join(" ");
                if (message.author.id !== client.config.ownerID) return;
                if (!args[0]) return message.channel.send(`Please provide some javascript to run, please!`);
                var depthObj = 2;
                if (flags && flags.d) depthObj= parseInt(flags.d)
                try {
                    const start = process.hrtime();
                    let output = eval(code);
                    const difference = process.hrtime(start)
                    if (typeof output !== "string") output = inspect(output, {depth: depthObj , maxArrayLength: null})
                    if (output == inspect(client, {depth: depthObj , maxArrayLength: null })) return message.channel.send("```js\nSanitized client object may not be outputed\n```")
                    if (output == inspect(client.config, {depth: depthObj , maxArrayLength: null})) return message.channel.send("```js\nSanitized client object may not be outputed\n```")
                    let initMsg =  await message.channel.send(stripIndents`
                    *Executed in ${difference[0] > 0 ? `${difference[0]}s ` : ""}${difference[1] / 1e6}ms*
                    \`\`\`js
                    ${output.length > 1950 ? await post(output.replace(client.token, `[SANITIZED BOT TOKEN]`)) : output.replace(client.token, `[SANITIZED BOT TOKEN]`)}
                    \`\`\`
                    `)
                    async function doReply(text) {
                        const start = process.hrtime();
                        if (typeof text !== "string") text = inspect(text, {depth: depthObj , maxArrayLength: null })
                        if (text == inspect(client, {depth: depthObj , maxArrayLength: null })) return message.channel.send("```js\nSanitized client object may not be outputed\n```")
                        if (text == inspect(client.config, {depth: depthObj , maxArrayLength: null })) return message.channel.send("```js\nSanitized client object may not be outputed\n```")
                        const difference = process.hrtime(start)
                        await message.channel.send(`*Callback (${difference[0] > 0 ? `${difference[0]}s ` : ""}${difference[1] / 1e6}ms):*\n\`\`\`js\n${text.length > 1950 ? await post(text.replace(client.token, `[SANITIZED BOT TOKEN]`)): text.replace(client.token, `[SANITIZED BOT TOKEN]`)}\`\`\``)
                    }
                }
                catch(err) {
                    return message.channel.send(stripIndents`
                    Error:
                    \`${err}\`
                    `)
                }
        
    },
}
