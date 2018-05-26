require('dotenv').config();
const twitter = require('twitter');
const yaml = require('js-yaml');
const fs = require('fs');
const { randomArrKey, pad, capitalizeFirstLetter } = require('./helper');

const client = new twitter({
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
});

const getDate = () => {
	const offset = 5 * 24 * 60 * 60 * 1000;
	const date = new Date(new Date() - offset * Math.random());
	return date;
};

const getTweets = async () => {
	const date = getDate();
	if (!process.env.TWITTER_CK) {
		return require('../txt/_cache.js');
	}
	return client.get('statuses/user_timeline', {
		screen_name: `dril`,
		exclude_replies: true,
		include_rts: false,
		trim_user: true,
		count: 199,
	});
};

const go = async () => {
	try {
		const tweets = (await getTweets())
			.filter(_ => _.text.length > 5)
			.filter(_ => !_.text.includes('t.co'))
			.filter(_ => !_.text.includes('RT'));

		const post = capitalizeFirstLetter(
			randomArrKey(tweets)
				.text.replace(/\n/g, ' ')
				.replace(/\#/g, '')
				.replace(/\@/g, '')
				.trim()
		);

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

module.exports = go;
