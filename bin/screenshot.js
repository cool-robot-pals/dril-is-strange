const server = require('../src/express.js');
const config = require('../.hellarc');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const isCmd = !module.parent;

const startServer = () =>
	new Promise(rt => {
		server.listen(
			config.ports.test,
			rt(`http://localhost:${config.ports.test}`)
		);
	});

const takeScreenshot = async (url, withLogging = isCmd) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		ignoreHTTPSErrors: true,
	});
	const page = await browser.newPage();

	const safeJSONParse = json => {
		try {
			return JSON.parse(json);
		} catch (e) {
			return {};
		}
	};

	return new Promise((yay, nay) => {
		let length = 1;
		let done = 0;
		page.on('console', async msg => {
			const log = safeJSONParse(msg.text());
			if (log.payload) {
				length = log.length;
				if (withLogging) console.info(chalk.blue(`i length ${length}`));
			}
			if (log.ready) {
				await page.waitFor(20); /*give subs time to render*/
				await page.screenshot({
					path: path.resolve(
						config.paths.out,
						`${config.names.screenie}-${done}.png`
					),
					type: 'png',
				});
				done++;
				if (withLogging) {
					console.info(chalk.blue(`i Screenshot ${done}/${length}`));
					console.info(JSON.stringify(log, null, '\t'));
				}

				if (done >= length) {
					await browser.close();
					yay({
						length,
						medias: log.posts.map((p, i) =>
							path.resolve(
								config.paths.out,
								`${config.names.screenie}-${i}.png`
							)
						),
						posts: log.posts,
					});
				}
			}
		});
		Promise.all([
			page.setViewport({ width: 1280, height: 720 }),
			page.goto(url),
		]).then(() => {
			if (withLogging) console.info(chalk.blue(`i Website open – wait for yt`));
		});
	});
};

const cleanUp = async () => {
	fs.emptyDirSync(config.paths.out);
	return Promise.resolve();
};

const cmd = async (withLogging = isCmd) => {
	const url = await startServer();
	if (withLogging) console.info(chalk.blue(`i Server started`));
	await cleanUp();
	const info = await takeScreenshot(url);
	if (withLogging) console.info(chalk.green(`✔ All Screenshots taken`));
	return info;
};

if (isCmd)
	cmd().then(() => {
		process.exit();
	});

module.exports = cmd;
