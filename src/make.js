const yaml = require('js-yaml');
const fs = require('fs');
const { randomArrKey, pad, capitalizeFirstLetter } = require('./helper/etc');
const { getTweets } = require('./getTweets');

const make = async () => {
	try {
		const tweets = await getTweets();

		const post = randomArrKey(tweets).text;
		const video = randomArrKey(
			yaml.safeLoad(fs.readFileSync('./txt/videos.txt', 'utf8'))
		);

		const monologue = Math.random() > 0.75;

		return {
			post,
			video,
			monologue,
		};
	} catch (e) {
		console.error(e);
	}
};

module.exports = { make };
