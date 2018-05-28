const {
	getTweetsFromTwitter,
	getTweetsFromCache,
} = require('./getTweets.js')._jest;

jest.mock('twitter', () => jest.fn());

describe('getTweetsFromCache', () => {
	it('gets tweets from cache.json', () => {
		expect(getTweetsFromCache()).toEqual(
			expect.arrayContaining(
				[
					'babies cant smile. its a biological reflex from the brain stem. its fake. they dont know how to smile',
				].map(_ => ({
					text: _,
				}))
			)
		);
	});
});

describe('getTweetsFromTwitter', () => {
	let i;
	const client = jest.fn(async () => {
		i++;
		return [
			{
				text: 'tweet',
				id_str: i,
			},
		];
	});

	beforeEach(() => {
		i = 0;
		jest.clearAllMocks();
	});

	it('calls the client several times', async () => {
		await getTweetsFromTwitter({ get: client }, 10);
		expect(client).toHaveBeenCalledTimes(10);
	});

	it('concats all tweets', async () => {
		const tweets = await getTweetsFromTwitter({ get: client }, 4);

		expect(tweets).toEqual(
			expect.arrayContaining(
				Array(4).fill(
					expect.objectContaining({
						text: 'tweet',
					})
				)
			)
		);
	});

	it('moves the pointer each time', async () => {
		await getTweetsFromTwitter({ get: client }, 3);
		expect(client.mock.calls[0][1].max_id).toBeFalsy;
		expect(client.mock.calls[1][1].max_id).toEqual(1);
		expect(client.mock.calls[2][1].max_id).toEqual(2);
	});
});
