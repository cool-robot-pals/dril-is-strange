const getPost = async () => {
	return fetch('/make').then(_ => _.json());
};

const seekPlayerToRandomSpot = player => {
	const length = player.getDuration() - 300;
	player.seekTo(150 + Math.random() * length, true);
	player.playVideo();
};

const addSubtitles = ($where, post, monologue) => {
	$where.innerHTML = post;
	if (monologue) where.classList.add('em');
};

const makeYoutubePlayer = (youtube, $video, videoId) =>
	new Promise(yay => {
		const player = new youtube.Player($video, {
			height: '1120',
			width: '1280',
			playerVars: {
				controls: 0,
				cc_load_policy: 0,
				rel: 0,
				mute: 1,
				modestbranding: 1,
			},
			enablejsapi: 1,
			videoId: videoId,
			events: {
				onReady: ev => yay(ev.target),
			},
		});
	});

window.onYouTubePlayerAPIReady = async () => {
	const [$video, $subs] = ['x-post x-video', 'x-post x-subs'].map($ =>
		document.querySelector($)
	);

	const { post, video, monologue } = await getPost();
	const player = await makeYoutubePlayer(window.YT, $video, video);

	seekPlayerToRandomSpot(player);
	addSubtitles($subs, post, monologue);

	console.log(
		JSON.stringify({
			ready: true,
			post,
		})
	);
};
