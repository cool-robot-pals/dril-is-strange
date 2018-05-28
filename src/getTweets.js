require('dotenv').config();
const twitter = require('twitter');

const getTweetsFromTwitter = async (client, loop) => {
	const tweets = [];

	const fetchFromApi = max_id =>
		client.get('statuses/user_timeline', {
			screen_name: `dril`,
			exclude_replies: true,
			include_rts: false,
			trim_user: true,
			count: 199,
			max_id,
		});

	for (const _ of Array(loop)) {
		const maxId = [...tweets].pop() ? [...tweets].pop().id_str : undefined;
		tweets.push(...(await fetchFromApi(maxId)).filter(_ => _.text));
	}

	return tweets;
};

const getTweetsFromCache = () => require('../txt/cache.json');

const twitterConfig = {
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
};

const getTweets = async () =>
	Object.values(twitterConfig).every(_ => _)
		? getTweetsFromTwitter(new twitter(twitterConfig), 4)
		: getTweetsFromCache();

const _jest = {
	getTweetsFromTwitter,
	getTweetsFromCache,
};

module.exports = { getTweets, _jest };
