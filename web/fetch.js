const onPlayerReady = (player, post) => {
	const length = player.getDuration() - 300;
	player.seekTo(150 + Math.random() * length, true);
	player.playVideo();
	document.querySelector('x-post x-subs').innerHTML = post;
	console.log('hella');
};

const getPost = async () => {
	return fetch('/make').then(_ => _.json());
};

window.onYouTubePlayerAPIReady = async () => {
	const { tweet, video } = await getPost();

	const player = new YT.Player(document.querySelector('x-post x-video'), {
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
		videoId: video,
		events: {
			onReady: ev => onPlayerReady(ev.target, tweet),
		},
	});
};
