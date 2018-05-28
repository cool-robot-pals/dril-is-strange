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
	if (!process.env.TWITTER_CK) {
		return require('../txt/_cache.js');
	}

	const date = getDate();
	const getTweets = max_id =>
		client.get('statuses/user_timeline', {
			screen_name: `dril`,
			exclude_replies: true,
			include_rts: false,
			trim_user: true,
			count: 199,
			max_id,
		});

	const tweets = [];

	for (const index of [1, 2, 3, 4]) {
		tweets.push(
			...(await getTweets(
				[...tweets].pop() ? [...tweets].pop().id_str : undefined
			)).filter(_ => _.text)
		);
	}

	return tweets;
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
