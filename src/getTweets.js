require('dotenv').config();
const twitter = require('twitter');

const twitterConfig = {
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
};

const cacheClient = () => ({
	get: () => require('../txt/cache.json'),
});

const fetchFromClient = (client, params) =>
	client.get('statuses/user_timeline', {
		exclude_replies: true,
		include_ext_alt_text: true,
		include_rts: false,
		trim_user: true,
		...params,
	});

const getExistingTweets = async client =>
	(await fetchFromClient(client, {
		screen_name: process.env.TWITTER_USER_ME,
		count: 40,
	})).map(tweet => {
		try {
			const altText = tweet.extended_entities.media[0].ext_alt_text;
			if (!altText) throw new Error('undefined alt txt');
			return altText;
		} catch (e) {
			console.error(`missing media info ${e}`);
			return '';
		}
	});

const filterDupes = async (client, tweets) => {
	try {
		const existingTweets = await getExistingTweets(client);
		console.log(tweets.length);
		const rt = tweets.filter(_ => !existingTweets.includes(_.text));
		console.log(rt.length);
		return rt;
	} catch (e) {
		console.error(`couldnt fetch existing tweets ${e}`);
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
		: new cacheClient();

const getTweets = async () => {
	const client = getClient(twitterConfig);
	return getTweetsFromClient(client, 4).then(tweets =>
		filterDupes(client, tweets)
	);
};

const _jest = {
	getTweetsFromClient,
	filterDupes,
	cacheClient,
};

module.exports = { getTweets, _jest };
