require('dotenv').config();
const twitter = require('twitter');
const fs = require('fs');
const { randomArrKey, txtToArr } = require('./helper');

const video = randomArrKey(
	txtToArr(fs.readFileSync('./txt/videos.txt', 'utf8'))
);

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
	return client.get('search/tweets', {
		q: `from:dril`,
		until: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
	});
};

const go = async () => {
	try {
		const tweets = (await getTweets()).statuses
			.filter(_ => _.text.length > 5)
			.filter(_ => !_.text.includes('t.co'));

		const tweet = randomArrKey(tweets)
			.text.replace(/\n/g, ' ')
			.trim();
		return {
			tweet,
			video,
		};
	} catch (e) {
		console.error(e);
	}
};

module.exports = go;
