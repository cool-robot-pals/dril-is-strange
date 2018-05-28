require('dotenv').config();
const twitter = require('twitter');

const getTweetsFromTwitter = async twitterConfig => {
	const tweets = [];

	const client = new twitter({
		consumer_key: process.env.TWITTER_CK,
		consumer_secret: process.env.TWITTER_CS,
		access_token_key: process.env.TWITTER_TK,
		access_token_secret: process.env.TWITTER_TS,
	});

	const fetchFromApi = max_id =>
		client.get('statuses/user_timeline', {
			screen_name: `dril`,
			exclude_replies: true,
			include_rts: false,
			trim_user: true,
			count: 199,
			max_id,
		});

	for (const index of [1, 2, 3, 4]) {
		tweets.push(
			...(await fetchFromApi(
				[...tweets].pop() ? [...tweets].pop().id_str : undefined
			)).filter(_ => _.text)
		);
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
		? getTweetsFromTwitter(twitterConfig)
		: getTweetsFromCache();

module.exports = { getTweets };
