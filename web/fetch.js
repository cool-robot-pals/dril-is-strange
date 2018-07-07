const getPost = async () => {
	return window.fetch('/make').then(_ => _.json());
};

const seekPlayerToRandomSpot = player => {
	const length = player.getDuration() - 300;
	const spot = 150 + Math.random() * length;
	player.seekTo(spot, true);
	return spot;
};

const addSubtitles = ($where, post, monologue = false) => {
	$where.innerHTML = post;
	if (monologue) $where.classList.add('em');
};

const makeYoutubePlayer = (youtube, { $video, video }) =>
	new Promise(yay => {
		const onPlayingCallbacks = [];
		const player = new youtube.Player($video, {
			height: '1120',
			width: '1280',
			playerVars: {
				controls: 0,
				autoplay: 0,
				cc_load_policy: 0,
				rel: 0,
				mute: 1,
				modestbranding: 1,
			},
			enablejsapi: 1,
			videoId: video,
			events: {
				onReady: ev =>
					yay({
						player: ev.target,
						onPlaying: cb => {
							onPlayingCallbacks.push(cb);
						},
					}),
				onStateChange: ev => {
					if (ev.data === 1) {
						onPlayingCallbacks.forEach(_ => _());
					}
				},
			},
		});
	});

const logOutput = (loggables = {}) => {
	console.log(
		JSON.stringify({
			ready: true,
			...loggables,
		})
	);
};

const main = async () => {
	const { post, video, monologue } = await getPost();
	const [$video, $subs] = ['x-post x-video', 'x-post x-subs'].map($ =>
		document.querySelector($)
	);

	const { player, onPlaying } = await makeYoutubePlayer(window.YT, {
		$video,
		video,
	});

	const spot = seekPlayerToRandomSpot(player);
	addSubtitles($subs, post, monologue);

	onPlaying(() => {
		logOutput({ post, video, spot });
	});
	player.playVideo();
};

window.onYouTubePlayerAPIReady = main;

if (module) {
	module.exports = {
		logOutput,
		makeYoutubePlayer,
		addSubtitles,
		seekPlayerToRandomSpot,
		getPost,
	};
}
