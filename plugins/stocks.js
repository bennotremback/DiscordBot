const snekfetch = require('snekfetch');

const stockPrice = (message) => {
	if(!message.content.startsWith('$')) return;

	const symbolQuery = message.content.split(' ')[0].replace('$', '').toUpperCase();
	const apiUrl = `https://query1.finance.yahoo.com/v7/finance/options/${symbolQuery}`;
	console.time('stock');
	snekfetch.get(apiUrl)
		.then(response => {
			console.timeEnd('stock');
			if(!response.body.optionChain.result[0].quote) return;
			const quote = response.body.optionChain.result[0].quote;

			let price = quote.regularMarketPrice;
			if(price == 0) return;
			const prevClose = quote.regularMarketPreviousClose;
			const currency = quote.currency;
			const symbol = quote.symbol;
			const name = quote.longName;
			const change = (((price - prevClose) / prevClose) * 100).toFixed(2);
			price = price.toLocaleString('en-US', { style: 'currency', currency: currency });

			const messageResult = `${symbol} - ${name} : ${price} (${change}%)`;
			message.channel.send(messageResult);
		}).catch(error => {
			// Invalid stock symbol
			if(error.status == 404) return;
			console.log(error);
		});
};

module.exports = {
	name: 'Stock Prices',
	commands: [
		{
			execute: stockPrice,
			isListener: true,
		},
	],
};