const { make } = require('./make.js');

const mockTweet = ['a', 'tweet'];
const mockVideos = ['asdf'];

jest.mock('./getTweets', () => ({
	getRandomTweet: jest.fn(() => [...mockTweet]),
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
		expect(post).toMatchObject({
			monologue: expect.any(Boolean),
			posts: ['a', 'tweet'],
			video: 'asdf',
		});
	});
});
