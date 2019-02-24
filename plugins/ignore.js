const moment = require('moment');
const fs = require('fs');
const parse = require('parse-duration');

const ignore = (message) => {
	if(message.author.id != message.guild.ownerID) {
		return;
	}

	const mention = message.mentions.members.firstKey();

	if(mention == undefined) {
		console.log('No mention found');
		return;
	}
	else {
		const args = message.argsString.split(/ +/);
		args.shift();

		const timeArg = args.join(' ');

		const duration = parse(timeArg);
		const ignoredUntil = moment().add(moment.duration(duration)).toISOString();

		const ignoreList = JSON.parse(fs.readFileSync('./ignored.json'));
		ignoreList[mention] = ignoredUntil;

		fs.writeFileSync('./ignored.json', JSON.stringify(ignoreList));

		message.channel.send('User ignored.');
	}
};

const unignore = (message) => {
	if(message.author.id != message.guild.ownerID) {
		return;
	}

	const mention = message.mentions.members.firstKey();

	if(mention == undefined) {
		console.log('No mention found');
		return;
	}
	else {
		const ignoreList = JSON.parse(fs.readFileSync('./ignored.json'));
		delete ignoreList[mention];

		fs.writeFileSync('./ignored.json', JSON.stringify(ignoreList));

		message.channel.send('User unignored.');
	}
};

module.exports = {
	name: 'Ignore',
	commands: [
		{
			triggers: ['!ignore'],
			execute: ignore,
		},
		{
			triggers: ['!unignore'],
			execute: unignore,
		},
	],
};