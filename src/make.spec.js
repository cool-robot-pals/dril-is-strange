const { make } = require('./make.js');

const mockTweets = ['a tweet'].map(_ => ({
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

describe('make', () => {
	it('should make a post', async () => {
		const post = await make();
		expect(post).toMatchObject({ post: 'a tweet', video: 'asdf' });
	});
});
