const snekfetch = require('snekfetch');
const { config } = require('../config');

const giphyKey = config.giphyKey;
const giphyApi = 'https://api.giphy.com/v1/gifs/';

const gif = (message, args) => {
	const query = args.join(' ');

	snekfetch.get(giphyApi + 'search', {
		query: {
			api_key: giphyKey,
			q: query,
		},
	}).then(response => {
		if(response.body.data.length < 1) return;

		const gifs = response.body.data;

		message.channel.send(gifs[0].url);
	});
};

const gifRandom = (message, args) => {
	const query = args.join(' ');

	snekfetch.get(giphyApi + 'random', {
		query: {
			api_key: giphyKey,
			tag: query,
		},
	}).then(response => {
		if(response.body.data.length < 1) return;

		const gifResp = response.body.data;

		message.channel.send(gifResp.url);
	});
};

module.exports = {
	name: 'Gifs',
	commands: [
		{
			trigger: '!gif',
			execute: gif,
		},
		{
			trigger: '!gifr',
			execute: gifRandom,
		},
	],
};