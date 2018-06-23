const { capitalizeFirstLetter } = require('./etc');

const filterTweets = tweets =>
	tweets.filter(_ => _.text.length > 5).filter(_ => !_.text.includes('t.co'));

const filterTweetText = tweet =>
	capitalizeFirstLetter(
		tweet
			.replace(/\n/g, ' ')
			.replace(/\#/g, 'hashtag ')
			.replace(/\@/g, 'at ')
			.trim()
	);

module.exports = {
	filterTweetText,
	filterTweets,
};
