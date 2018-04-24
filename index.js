const discord = require('discord.js');
const fs = require('fs');
const { updatePlaying } = require('./plugins/crypto');
const { config } = require('./config');

const client = new discord.Client();
const token = config.discordAuthToken;

client.commands = [];
client.listeners = [];

const pluginFiles = fs.readdirSync('./plugins');
pluginFiles.forEach((file) => {
	const plugin = require(`./plugins/${file}`);

	plugin.commands.forEach((command) => {
		if(command.isListener) {
			client.listeners.push(command);
		}
		else {
			client.commands.push({ triggers: command.triggers, execute: command.execute });
		}
	});
});

const findCommand = (cmdString) => {
	return client.commands.find(command => {
		return command.triggers.includes(cmdString);
	});
};

client.on('ready', () => {
	console.log('Ready');
	updatePlaying(client);
	setInterval(updatePlaying, 60 * 5 * 1000, client);
});

client.on('message', message => {
	if(message.author.bot) return;

	client.listeners.forEach(listener => {
		listener.execute(message);
	});

	const command = message.content.split(/ +/).shift().toLowerCase();

	if(!findCommand(command)) return;

	const argsRegex = /(?:"(.+?)"|([\w]+))+/g;
	let m;
	const args = [];

	while ((m = argsRegex.exec(message.content)) !== null) {
		if (m.index === argsRegex.lastIndex) {
			argsRegex.lastIndex++;
		}
		args.push(m[1] ? m[1] : m[2]);
	}

	args.shift();

	findCommand(command).execute(message, args);
});

client.login(token);
