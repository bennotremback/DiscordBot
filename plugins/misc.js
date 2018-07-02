const gtranslate = require('google-translate-api');
const languages = require('country-data').languages;

const _8ball = (message) => {
	const answers = [
		'Yes',
		'No',
	];

	message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
};

const choose = (message, args) => {
	const choice = args[Math.floor(Math.random() * args.length)];
	message.channel.send(choice);
};

const translate = (message, args) => {
	let language = 'en';
	if(args[0].startsWith('to=')) {
		const country = args[0].replace('to=', '');
		const foundLang = languages.all.find(el => {
			return el.name.toLowerCase() == country.toLowerCase();
		});

		if (foundLang != undefined) {
			language = foundLang.alpha2;
		}

		args.shift();
	}
	gtranslate(args.join(' '), { to: language }).then(res => {
		message.channel.send(res.text);
	});
};

module.exports = {
	name: '8ball',
	commands: [
		{
			triggers: ['!8', '!8ball'],
			execute: _8ball,
		},
		{
			triggers: ['!choose'],
			execute: choose,
		},
		{
			triggers: ['!translate', '!tr'],
			execute: translate,
		},
	],
};