const snekfetch = require('snekfetch');
const jimp = require('jimp');
const { config } = require('../config');

const apiKey = config.wolframAlphaKey;
const apiUrl = 'http://api.wolframalpha.com/v2/query';

const wolframAlpha = (message) => {
	const query = message.content.replace('!wa', '');

	snekfetch.get(apiUrl, {
		query: {
			appid: apiKey,
			output: 'json',
			input: query,
			ip: '52.41.96.17',
		},
	}).then(response => {
		response.body = JSON.parse(response.body.toString());
		if(!response.body.queryresult.success) return;
		let primaryPod = response.body.queryresult.pods.find(pod => {
			return pod.primary !== undefined;
		});

		if(!primaryPod) {
			primaryPod = response.body.queryresult.pods.find(pod => {
				return pod.title == 'Results' || pod.title == 'Result';
			});
		}

		if(!primaryPod) return;

		const resultImg = primaryPod.subpods[0].img.src;
		if(primaryPod.subpods[0].plaintext != '') {
			jimp.read(resultImg)
				.then((img) => {
					const background = new jimp(img.bitmap.width + 4, img.bitmap.height + 4, 0xFFFFFFFF);
					background.composite(img, 2, 2).getBuffer(background.getMIME(), (err, buffer) => {
						message.channel.send({
							files: [{
								attachment: buffer,
								name: 'result.gif',
							}],
						});

					});
				});
		}
		else {
			message.channel.send({
				files: [{
					attachment: resultImg,
					name: 'result.gif',
				}],
			});
		}
	}).catch(console.log);
};

module.exports = {
	name: 'Wolfram Alpha',
	commands: [
		{
			execute: wolframAlpha,
			triggers: ['!wa', '!wolframalpha'],
		},
	],
};