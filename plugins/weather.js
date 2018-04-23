const discord = require('discord.js');
const snekfetch = require('snekfetch');
const { config } = require('../config');

const weather = (message, args) => {
	const queryLocation = args.join(' ');

	const weatherApi = 'http://api.openweathermap.org/data/2.5/weather';
	const weatherKey = config.openWeatherMapKey;

	const geocodeKey = config.googleGeocodeKey;
	const geocodeApi = 'https://maps.googleapis.com/maps/api/geocode/json';

	snekfetch.get(geocodeApi, {
		query: {
			address: queryLocation,
			key: geocodeKey,
		},
	}).then(geocodeResponse => {
		if(geocodeResponse.body.status == 'ZERO_RESULTS') return;
		const location = geocodeResponse.body.results[0].geometry.location;
		const address = geocodeResponse.body.results[0].formatted_address;

		snekfetch.get(weatherApi, {
			query: {
				appid: weatherKey,
				lat: location.lat,
				lon: location.lng,
			},
		}).then(weatherResponse => {
			let condition = weatherResponse.body.weather[0].description;
			condition = condition.charAt(0).toUpperCase() + condition.slice(1);
			const conditionIcon = weatherResponse.body.weather[0].icon;
			const temperature = weatherResponse.body.main.temp;
			const tempF = (9 / 5 * (temperature - 273) + 32).toFixed(1);
			const tempC = (temperature - 273).toFixed(1);
			const pressure = weatherResponse.body.main.pressure;
			const humidity = weatherResponse.body.main.humidity;
			const windSpeed = weatherResponse.body.wind.speed;
			const windSpeedMiles = (windSpeed * 2.2369).toFixed(1);
			const windSpeedKm = (windSpeed * 3.6).toFixed(1);

			const weatherEmbed = new discord.RichEmbed();
			weatherEmbed.setTitle(' ');
			weatherEmbed.setDescription('\n');
			weatherEmbed.setAuthor(`${condition} in ${address}`, `http://openweathermap.org/img/w/${conditionIcon}.png`);
			weatherEmbed.setColor('0x00AE86');
			weatherEmbed.setURL(' ');
			weatherEmbed.addField('**Temperature**', `${tempC} °C\n${tempF} °F`, true);
			weatherEmbed.addField('**Wind**', `${windSpeedKm} km/h\n${windSpeedMiles} mph`, true);
			weatherEmbed.addField('**Pressure / Humidity**', `${pressure} hPa / ${humidity}%`, true);
			message.channel.send(weatherEmbed);
		}).catch(console.log);
	}).catch(console.log);
};

module.exports = {
	name: 'Weather',
	commands: [
		{
			execute: weather,
			trigger: '!we',
		},
	],
};