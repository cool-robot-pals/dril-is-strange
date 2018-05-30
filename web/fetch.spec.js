const {
	logOutput,
	makeYoutubePlayer,
	addSubtitles,
	seekPlayerToRandomSpot,
	getPost,
} = require('./fetch');

beforeEach(() => {
	global.fetchResponse = {
		json: jest.fn(() => Promise.resolve('{}')),
		text: jest.fn(() => Promise.resolve('no')),
	};
	global.fetch = jest.fn(() => Promise.resolve(global.fetchResponse));
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.5;
	global.Math = mockMath;
});

describe('getPost', () => {
	it('should get a post', async () => {
		await getPost();
		expect(global.fetch).toHaveBeenCalled();
		expect(global.fetchResponse.json).toHaveBeenCalled();
		expect(global.fetchResponse.text).not.toHaveBeenCalled();
	});
});

describe('seekPlayerToRandomSpot', () => {
	it('should seek player to a random spot', async () => {
		const player = {
			getDuration: jest.fn(() => 600),
			seekTo: jest.fn(),
			playVideo: jest.fn(),
		};

		seekPlayerToRandomSpot(player);
		expect(player.seekTo.mock.calls[0][0]).toEqual(300);
		expect(player.playVideo).toHaveBeenCalled();
	});
});

describe('addSubtitles', () => {
	const $where = {
		innerHTML: '',
		classList: { add: jest.fn() },
	};
	it('should add subtitles', async () => {
		addSubtitles($where, 'yolo');
		expect($where.innerHTML).toMatch('yolo');
	});
	it('should add em subtitles', async () => {
		addSubtitles($where, 'yolo em', true);
		expect($where.classList.add.mock.calls[0][0]).toEqual('em');
	});
});

describe('logOutput', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		global.console.log = jest.fn();
	});
	it('should log output', async () => {
		logOutput();
		expect(global.console.log.mock.calls[0][0]).toMatch('{"ready":true}');
	});
	it('should log extras', async () => {
		logOutput({ extra: 'hi' });
		expect(global.console.log.mock.calls[0][0]).toMatch(
			'{"ready":true,"extra":"hi"}'
		);
	});
});
