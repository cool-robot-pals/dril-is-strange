require('dotenv').config();

const getPost = require('./screenshot');
const config = require('../.hellarc');
const twitterLite = require('twitter-lite');
const twitter = require('twitter');
const fs = require('fs');
const chalk = require('chalk');
const { randomArrKey } = require('./../src/helper');

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

(async () => {
	try {
		const data = await getPost();

		console.info(chalk.blue(`i Post info:`));
		console.info(data);

		const screenshot = await client.post('media/upload', {
			media: fs.readFileSync(config.paths.screenie),
		});

		const media = await mediaClient.post('media/metadata/create', {
			media_id: screenshot.media_id_string,
			alt_text: {
				text: data.post.substring(0, 420),
			},
		});

		const tweet = await client.post('statuses/update', {
			media_ids: screenshot.media_id_string,
			status: '',
		});

		console.info(chalk.blue(`i Conn info:`));
		console.info(JSON.stringify({ media }, null, '\t'));
		console.info(chalk.green(`✔ Posted: ${data.post}`));
		return true;
	} catch (error) {
		console.error(chalk.red('✘ Post failed'));
		console.error(error);
		return;
	}
})().then(() => process.exit());
