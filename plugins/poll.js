const currentPoll = {};
let activePoll = false;

const poll = (message) => {
	if(activePoll) {
		message.channel.send('Another poll is currently in progress');
		return;
	}
	activePoll = true;
	const pollString = message.content.replace('!poll', '');
	const pollParams = pollString.split(';');
	const pollQuestion = pollParams.shift().trim();

	let pollStartMessage = '**POLL STARTED**\n\n' + pollQuestion + '\n\n';
	currentPoll.question = pollQuestion;

	currentPoll.options = [];
	currentPoll.votes = {};
	pollParams.forEach((option, index) => {
		pollStartMessage += `${index + 1}. **${option.trim()}**\n`;
		currentPoll.options.push(option);
	});

	pollStartMessage += '\nType the number to vote';

	message.channel.send(pollStartMessage);
	setTimeout(endPoll, 2 * 60 * 1000, message.channel);
};

const endPoll = (channel) => {
	activePoll = false;
	let pollEndMessage = `**POLL ENDED**\n\n${currentPoll.question}\n\n`;

	currentPoll.options.forEach((option, index) => {
		let votes = 0;
		Object.values(currentPoll.votes).forEach(vote => {
			if(vote - 1 == index) votes++;
		});

		pollEndMessage += `**${option}**: ${votes}\n`;
	});

	channel.send(pollEndMessage);
};

const pollListener = (message) => {
	if(Number.isNaN(Number(message.content)) || !activePoll) return;

	if(!currentPoll.votes.hasOwnProperty(message.author.id)) {
		currentPoll.votes[message.author.id] = Number(message.content);
	}
};

module.exports = {
	name: 'Poll',
	commands: [
		{
			execute: poll,
			trigger: '!poll',
		},
		{
			execute: pollListener,
			isListener: true,
		},
	],
};