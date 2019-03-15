require('dotenv').config();
const twitter = require('twitter');
const chalk = require('chalk');
const { filterTweetText, filterTweets } = require('./helper/tweet.js');
const { randomArrKey, shuffle } = require('./helper/etc');

const twitterConfig = {
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
};

const backArchiveClient = () => ({
	get: () => shuffle(require('../txt/back-archive.json')).slice(0, 400),
});

const fetchFromClient = (client, params) =>
	client.get('statuses/user_timeline', {
		exclude_replies: true,
		include_ext_alt_text: true,
		include_rts: false,
		trim_user: true,
		...params,
	});

const getExistingTweets = async (client, user) =>
	(await fetchFromClient(client, {
		screen_name: process.env.TWITTER_USER_ME,
		count: 80,
	})).map(tweet => {
		const altText = tweet.extended_entities.media[0].ext_alt_text;
		if (!altText) {
			console.info(
				chalk.red(
					`✘ Undefined alt txt in https://twitter.com/status/status/${
						tweet.id_str
					}`
				)
			);
			return '';
		}
		return altText;
	});

const filterDupes = async (client, tweets) => {
	try {
		const existingTweets = await getExistingTweets(
			client,
			process.env.TWITTER_USER_ME
		);
		return tweets.filter(_ => !existingTweets.includes(_.text));
	} catch (e) {
		console.error(`couldn't fetch existing tweets ${e}`);
		return tweets;
	}
};

const getTweetsFromClient = async (client, loop) => {
	const tweets = [];

	const fetchWithMaxId = maxId =>
		fetchFromClient(client, {
			screen_name: `dril`,
			count: 199,
			max_id: maxId,
		});

	for (const _ of Array(loop)) {
		const maxId = [...tweets].pop() ? [...tweets].pop().id_str : undefined;
		tweets.push(...(await fetchWithMaxId(maxId)).filter(_ => _.text));
	}

	return tweets;
};

const getClient = twitterConfig =>
	Object.values(twitterConfig).every(_ => _)
		? new twitter(twitterConfig)
		: backArchiveClient();

const getTweets = async () => {
	const client = getClient(twitterConfig);
	return Promise.all([
		getTweetsFromClient(client, 4),
		getTweetsFromClient(backArchiveClient(), 1),
	])
		.then(results => results.reduce((acc, _) => [...acc, ..._], []))
		.then(filterTweets)
		.then(tweets =>
			tweets.map(tweet => ({
				...tweet,
				text: filterTweetText(tweet.text),
			}))
		)
		.then(tweets => filterDupes(client, tweets));
};

const getRandomTweet = async () => {
	const tweets = await getTweets();
	return randomArrKey(tweets)
		.text.split('. ')
		.map(filterTweetText);
};

const _jest = {
	getTweetsFromClient,
	filterDupes,
	backArchiveClient,
};

module.exports = { getTweets, getRandomTweet, _jest };
