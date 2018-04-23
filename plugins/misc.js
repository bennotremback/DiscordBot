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
			trigger: '!8',
			execute: _8ball,
		},
		{
			trigger: '!choose',
			execute: choose,
		},
	],
};