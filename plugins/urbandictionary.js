const snekfetch = require('snekfetch');

const urbanDictionary = (message, args) => {
	let definitionNum = NaN;
	if(args.length > 1) {
		definitionNum = Number(args[args.length - 1]);
		if(!Number.isNaN(definitionNum)) args.pop();
	}
	const query = args.join(' ');
	const udApi = 'http://api.urbandictionary.com/v0/define';

	snekfetch.get(udApi, { query: { term: query } })
		.then(response => {
			if(response.body.result_type == 'no_results') return;
			let definitionList = response.body.list;
			definitionList = definitionList.filter(def => query.toLowerCase() == def.word.toLowerCase());
			const numDefinitions = definitionList.length;
			if((!Number.isNaN(definitionNum) && definitionNum > numDefinitions) || numDefinitions == 0) return;
			const currentNum = Number.isNaN(definitionNum) ? 1 : definitionNum;

			let messageResult = `\n**Definition #${currentNum} out of ${numDefinitions}:**\n`;
			messageResult = messageResult + `${definitionList[currentNum - 1].definition}\n\n`;
			messageResult = messageResult + '**Example:**\n';
			messageResult = messageResult + `${definitionList[currentNum - 1].example}`;

			message.channel.send(messageResult, { split: true });
		}).catch(console.log);
};

const randomDef = (message) => {
	const randomUdApi = 'http://api.urbandictionary.com/v0/random';
	snekfetch.get(randomUdApi)
		.then(response => {
			if(response.body.result_type == 'no_results') return;
			const definitionList = response.body.list;

			let messageResult = `${definitionList[0].definition}\n\n`;
			messageResult = messageResult + '**Example:**\n';
			messageResult = messageResult + `${definitionList[0].example}`;

			message.channel.send(messageResult, { split: true });
		}).catch(console.log);
};

module.exports = {
	name: 'Urban Dictionary',
	commands: [
		{
			triggers: ['!ud'],
			execute: urbanDictionary,
		},
		{
			triggers: ['!udrandom', '!randomud', '!udrand'],
			execute: randomDef,
		},
	],
};