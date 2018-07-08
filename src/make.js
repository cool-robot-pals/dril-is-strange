const yaml = require('js-yaml');
const fs = require('fs');
const { randomArrKey, pad, capitalizeFirstLetter } = require('./helper/etc');
const { getRandomTweet } = require('./getTweets');

const make = async () => {
	try {
		const posts = await getRandomTweet();
		const video = randomArrKey(
			yaml.safeLoad(fs.readFileSync('./txt/videos.txt', 'utf8'))
		);

		const monologue = Math.random() > 0.75;

		return {
			posts,
			video,
			monologue,
		};
	} catch (e) {
		console.error(e);
	}
};

module.exports = { make };
