const fs = require('fs').promises;
const path = require('path');
const unloadedModules = require('./modules.json')
async function registerCommands(client, dir) {
    const commandFiles = await fs.readdir(path.join(__dirname, dir));
    for (const file of commandFiles) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) // If file is a directory, recursive call recurDir
            registerCommands(client, path.join(dir, file));
        else {
            if (file.endsWith(".js")) {
                try {
                    const command = require(path.join(__dirname, dir, file));   
                    if (!command) {console.error(`${file} does not seem to export anything. Ignoring the command.`); continue;}
                    if (!command.name) {console.error(`${file} does not export a name. Ignoring the command.`); continue;}
                    if (unloadedModules.commands.includes(command) || command.aliases.every((a) => unloadedModules.commands.unloaded.includes(a))) {console.log(`${file} blacklisted from being loaded.`); continue;}
                    command.filepath = path.join(__dirname, dir, file);
                    if (client.categories.has(command.category) && command.name) client.categories.get(command.category)
                        .commands.push(command)
                    if (command.name) client.commands.set(command.name, command);
                    if (command.name) {
                        for (const alias of command.aliases) {
                            client.aliases.set(alias, command)
                        }
                    }
                }
                catch(e) {console.error(`❌ | There was an error loading ${file}:\n`, e)}
            }
        }
    }
}
async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
  }
async function findFile(name, dir, casesensitive=true) {
    const files = await getFiles(dir)
    for (const file of files) {
        if (casesensitive) {
            if (path.basename(file) == name) return file;
        }
        else {
            if (path.basename(file).toLowerCase() == name.toLowerCase()) return file;
        }
    }
}
async function registerEvents(client, dir) {
    let files = await fs.readdir(path.join(__dirname, dir));
    // Loop through each file.
    for (let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) // If file is a directory, recursive call recurDir
            registerEvents(client, path.join(dir, file));
        else {
            // Check if file is a .js file.
            if (file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    if (!eventModule) {console.error(`${file} does not seem to export anything. Ignoring the event.`); continue;} 
                    if (typeof eventModule !== "function") {console.error(`Expected a function for the event handler... Got ${typeof eventModule}.`); continue; } 
                    console.log(`📂 ${dir} | ${eventName} event loaded!`)
                    client.on(eventName, eventModule.bind(null, client));
                } catch (err) {
                    console.log(`❌ | There was an error running ${file}!`)
                    console.error(err);
                }
            }
        }
    }
}

module.exports = {
    registerEvents,
    registerCommands,
    getFiles,
    findFile
};