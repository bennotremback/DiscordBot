const discord = require('discord.js');
const snekfetch = require('snekfetch');
const { config } = require('../config');

const weather = (message) => {
	const queryLocation = message.argsString;

	const weatherApi = 'https://api.darksky.net/forecast/';
	const weatherKey = config.darkskyKey;

	const geocodeApi = 'https://maps.googleapis.com/maps/api/geocode/json';
	const geocodeKey = config.googleGeocodeKey;

	snekfetch.get(geocodeApi, {
		query: {
			address: queryLocation,
			key: geocodeKey,
		},
	}).then(geocodeResponse => {
		if(geocodeResponse.body.status == 'ZERO_RESULTS') return;
		const location = geocodeResponse.body.results[0].geometry.location;
		const address = geocodeResponse.body.results[0].formatted_address;

		snekfetch.get(weatherApi + weatherKey + '/' + location.lat + ',' + location.lng).then(weatherResponse => {
			message.channel.send(processWeatherResponse(weatherResponse, address));
		}).catch(console.log);
	}).catch(console.log);
};

const processWeatherResponse = (response, address) => {
	const condition = response.body.currently.summary;
	const temperature = response.body.currently.temperature;
	// temperatures are returned in fahrenheit
	const tempF = temperature.toFixed(1);
	const tempC = ((temperature - 32) * (5 / 9)).toFixed(1);
	const pressure = response.body.currently.pressure.toFixed(1);
	const humidity = response.body.currently.humidity * 100;
	const windSpeedMiles = response.body.currently.windSpeed.toFixed(1);
	const windSpeedKm = (windSpeedMiles * 1.609344).toFixed(1);

	const weatherEmbed = new discord.RichEmbed();
	weatherEmbed.setTitle(' ');
	weatherEmbed.setDescription('\n');
	weatherEmbed.setAuthor(`${condition} in ${address}`);
	weatherEmbed.setColor('0x00AE86');
	weatherEmbed.setURL(' ');
	weatherEmbed.addField('**Temperature**', `${tempC} °C\n${tempF} °F`, true);
	weatherEmbed.addField('**Wind**', `${windSpeedKm} km/h\n${windSpeedMiles} mph`, true);
	weatherEmbed.addField('**Pressure / Humidity**', `${pressure} hPa / ${humidity}%`, true);

	return weatherEmbed;
};


module.exports = {
	name: 'Weather',
	commands: [
		{
			execute: weather,
			triggers: ['!we', '!weather'],
		},
	],
};