const snekfetch = require('snekfetch');
const fs = require('fs');

const checkScores = (cb) => {
	const apiUrl = 'https://fantasy.premierleague.com/drf/leagues-classic-standings/92365?phase=1&le-page=1&ls-page=1';
	let savedScores = fs.readFileSync('scores.json', { encoding: 'utf8', flag: 'a+' });
	let changed = false;
	let retVal = null;

	snekfetch.get(apiUrl)
		.then(response => {
			if(savedScores == '') {
				fs.writeFileSync('scores.json', JSON.stringify(response.body.standings.results));
				cb(retVal);
			}
			else {
				savedScores = JSON.parse(savedScores);
				const newScores = response.body.standings.results;

				newScores.forEach(score => {
					const savedScore = savedScores.find(saved => saved.id == score.id);

					if(savedScore) {
						if(savedScore.total != score.total) {
							changed = true;
						}
					}
				});

				if(changed) {
					fs.writeFileSync('scores.json', JSON.stringify(newScores));
					retVal = JSON.stringify(newScores);
				}
				cb(retVal);
			}
		});

};

const scores = (message) => {
	const apiUrl = 'https://fantasy.premierleague.com/drf/leagues-classic-standings/92365?phase=1&le-page=1&ls-page=1';

	snekfetch.get(apiUrl)
		.then(response => {

			const curScores = response.body.standings.results;

			let msg = '';
			msg += 'Fantasy Scores:\n';
			curScores.forEach(result => {
				msg += `**${result.rank}**: `;
				msg += `${result.entry_name} - ${result.total} (${result.event_total})`;
				msg += '\n';
			});

			message.channel.send(msg);
		});
};

module.exports = {
	name: 'Fantasy',
	commands: [
		{
			execute: scores,
			triggers: ['!scores'],
		},
	],
	checkScores,
};