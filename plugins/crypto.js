const snekfetch = require('snekfetch');

const coinPrice = (message) => {
	if(message.content.startsWith('%')) {
		const coin = message.content.split(' ')[0].slice(1);
		const apiUrl = 'https://api.coinmarketcap.com/v1/ticker/?limit=0';
		console.time('coin');
		snekfetch.get(apiUrl)
			.then(response => {
				console.timeEnd('coin');
				const coinObject = response.body.find(element => {
					return element.name.toLowerCase() == coin || element.symbol.toLowerCase() == coin;
				});
				if(coinObject) {
					const name = coinObject.name;
					const symbol = coinObject.symbol;
					const price = coinObject.price_usd;
					const change = coinObject.percent_change_24h;
					const messageResult = `${symbol} - ${name}: $${price} (${change}%)`;
					message.channel.send(messageResult);
				}
			}).catch(console.log);
	}
	return;
};

const updatePlaying = (client) => {
	const apiUrl = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';
	snekfetch.get(apiUrl)
		.then(response => {
			const price = response.body[0].price_usd;
			client.user.setActivity(price)
				.catch(error => {
					console.log(error);
				});
		}).catch(console.log);
};

module.exports = {
	name: 'Crypto',
	commands: [
		{
			execute: coinPrice,
			isListener: true,
		},
	],
	updatePlaying,
};