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
	],
};