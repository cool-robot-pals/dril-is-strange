const { make } = require('./make.js');
const { filterTweet, filterTweets } = require('./make.js')._jest;

const mockTweets = ['valid tweet', 't.co link tweet'].map(_ => ({
	text: _,
}));
const mockVideos = ['asdf'];

jest.mock('./getTweets', () => ({
	getTweets: jest.fn(() => [...mockTweets]),
}));
jest.mock('js-yaml', () => ({
	safeLoad: jest.fn(() => [...mockVideos]),
}));
jest.mock('fs', () => ({
	readFileSync: jest.fn(() => '🙂🙂🙂🙂'),
}));

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

describe('filterTweet', () => {
	it('should filter @, #, & capitalize', () => {
		expect(filterTweet('@tweet #tweet')).toEqual('Tweet tweet');
	});
});

describe('make', () => {
	it('should make a post', async () => {
		const post = await make();
		expect(post).toMatchObject({ post: 'Valid tweet', video: 'asdf' });
	});
});
