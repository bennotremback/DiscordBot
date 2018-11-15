const discord = require('discord.js');
const fs = require('fs');
const { updatePlaying } = require('./plugins/crypto');
const { updateStockPlaying } = require('./plugins/stocks');
const { config } = require('./config');
const { checkScores } = require('./plugins/fantasy');

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

const scoreUpdate = () => {
	checkScores((retn) => {
		if(!retn) return;
		let msg = '';
		msg += 'New fantasy scores: \n';
		JSON.parse(retn).forEach(result => {
			msg += `**${result.rank}**: `;
			msg += `${result.entry_name} - ${result.total} (${result.event_total})`;
			msg += '\n';
		});
		client.channels.get('105433664761933824').send(msg);
	});
};

client.on('ready', () => {
	console.log('Ready');
	updateStockPlaying(client);
	scoreUpdate();
	setInterval(updateStockPlaying, 60 * 5 * 1000, client);
	setInterval(scoreUpdate, 60 * 5 * 1000);
});

client.on('message', message => {
	processMessage(message);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	processMessage(newMessage);
});

const processMessage = (message) => {
	if(message.author.bot) return;

	client.listeners.forEach(listener => {
		listener.execute(message);
	});

	const command = message.content.split(/ +/).shift().toLowerCase();

	if(!findCommand(command)) return;

	const argsRegex = /([^\s"']+)|"([^"]*)"|'([^']*)'/g;
	let m;
	const args = [];

	while ((m = argsRegex.exec(message.content)) !== null) {
		if (m.index === argsRegex.lastIndex) {
			argsRegex.lastIndex++;
		}
		args.push(m[1] ? m[1] : m[2]);
	}

	args.shift();

	message.argsString = args.join(' ');

	findCommand(command).execute(message, args);
}

client.login(token);
