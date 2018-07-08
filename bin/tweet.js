require('dotenv').config();

const getPost = require('./screenshot');
const config = require('../.hellarc');
const twitterLite = require('twitter-lite');
const twitter = require('twitter');
const fs = require('fs');
const chalk = require('chalk');
const { randomArrKey } = require('./../src/helper/etc');

const twitterParams = {
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
};

const client = new twitter({
	...twitterParams,
});
const mediaClient = new twitterLite({
	...twitterParams,
	subdomain: 'upload',
});

const uploadMedia = async (media, alt) => {
	const screenshot = await client.post('media/upload', {
		media: fs.readFileSync(media),
	});

	/*
	media/metadata/create is hella flaky and will often
	return an invalid response but actually post the
	alt text anyway. This is why we're eating up its 
	error responses here instead of throwing them
	*/
	await mediaClient
		.post('media/metadata/create', {
			media_id: screenshot.media_id_string,
			alt_text: {
				text: alt.substring(0, 420),
			},
		})
		.catch(() => {});

	return screenshot.media_id_string;
};

(async () => {
	try {
		const data = await getPost(true);

		console.info(chalk.blue(`i Post info:`));
		console.info(data);

		const media_ids = await Promise.all(
			data.medias.map((media, index) => uploadMedia(media, data.posts[index]))
		);

		console.log(media_ids.join(','));

		const tweet = await client.post('statuses/update', {
			media_ids: media_ids.join(','),
			status: '',
		});

		console.info(chalk.blue(`i Conn info:`));
		console.info(JSON.stringify({ media_ids, tweet }, null, '\t'));
		console.info(chalk.green(`✔ Posted`));
		console.info(JSON.stringify(data.posts, null, '\t'));
		return true;
	} catch (error) {
		console.error(chalk.red('✘ Post failed'));
		console.error(error);
		return;
	}
})().then(() => process.exit());
