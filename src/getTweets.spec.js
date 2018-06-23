const {
	getTweetsFromClient,
	filterDupes,
	backArchiveClient,
} = require('./getTweets.js')._jest;

jest.mock('twitter', () => jest.fn());

describe('backArchiveClient', () => {
	it('is type safe', () => {
		expect(backArchiveClient()).toEqual(
			expect.objectContaining({
				get: expect.anything(),
			})
		);
	});
	it('gets tweets from back-archive.json', async () => {
		expect(await getTweetsFromClient(backArchiveClient(), 1)).toEqual(
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

describe('getTweetsFromClient', () => {
	let i;
	const client = {
		get: jest.fn(async () => {
			i++;
			return [
				{
					text: 'tweet',
					id_str: i,
				},
			];
		}),
	};

	beforeEach(() => {
		i = 0;
		jest.clearAllMocks();
	});

	it('calls the client several times', async () => {
		await getTweetsFromClient(client, 10);
		expect(client.get).toHaveBeenCalledTimes(10);
	});

	it('concats all tweets', async () => {
		const tweets = await getTweetsFromClient(client, 4);

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
		await getTweetsFromClient(client, 3);
		expect(client.get.mock.calls[0][1].max_id).toBeFalsy;
		expect(client.get.mock.calls[1][1].max_id).toEqual(1);
		expect(client.get.mock.calls[2][1].max_id).toEqual(2);
	});
});
