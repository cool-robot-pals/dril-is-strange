const yaml = require('js-yaml');
const fs = require('fs');
const { randomArrKey, pad, capitalizeFirstLetter } = require('./helper');
const { getTweets } = require('./getTweets');

const filterTweets = tweets =>
	tweets.filter(_ => _.text.length > 5).filter(_ => !_.text.includes('t.co'));

const filterTweet = tweet =>
	capitalizeFirstLetter(
		tweet
			.replace(/\n/g, ' ')
			.replace(/\#/g, '')
			.replace(/\@/g, '')
			.trim()
	);

const make = async () => {
	try {
		const tweets = filterTweets(await getTweets());

		const post = filterTweet(randomArrKey(tweets).text);
		const video = randomArrKey(
			yaml.safeLoad(fs.readFileSync('./txt/videos.txt', 'utf8'))
		);

		const monologue = Math.random() > 0.5;

		return {
			post,
			video,
			monologue,
		};
	} catch (e) {
		console.error(e);
	}
};

const _jest = {
	filterTweet,
	filterTweets,
};

module.exports = { make, _jest };
