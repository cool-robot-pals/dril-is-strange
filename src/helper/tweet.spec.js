const { filterTweetText, filterTweets } = require('./tweet.js');

const mockTweets = ['valid tweet', 't.co link tweet'].map(_ => ({
	text: _,
}));
const mockVideos = ['asdf'];

describe('filterTweets', () => {
	it('should filter link posts', () => {
		const filtered = filterTweets(mockTweets);

		expect(filtered).toEqual(
			expect.not.arrayContaining(
				['t.co link tweet'].map(_ => ({
					text: _,
				}))
			)
		);

		expect(filtered).toEqual(
			expect.arrayContaining(
				['valid tweet'].map(_ => ({
					text: _,
				}))
			)
		);
	});
});

describe('filterTweetText', () => {
	it('should filter @, #, & capitalize', () => {
		expect(filterTweetText('@tweet #tweet')).toEqual('At tweet hashtag tweet');
	});
});
