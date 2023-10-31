
module.exports = {
	name: 'error',
	aliases: [],
	cooldown: 2,
	usage: `error`,
	description: 'Throws an error to the console!',
	ownerOnly: true,
	Ready: true,
	async execute(message, args, client) {
		throw new Error("Error command")
    },
}
