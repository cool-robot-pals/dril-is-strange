const server = require('../src/express.js');
const config = require('../.hellarc');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');

const isCmd = !module.parent;

const startServer = () =>
	new Promise(rt => {
		server.listen(
			config.ports.test,
			rt(`http://localhost:${config.ports.test}`)
		);
	});

const takeScreenshot = async url => {
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
				if (isCmd) console.info(chalk.blue(`i length ${length}`));
			}
			if (log.ready) {
				done++;
				await page.screenshot({
					path: path.resolve(
						config.paths.out,
						`${config.names.screenie}-${done}.png`
					),
					type: 'png',
				});
				if (isCmd) {
					console.info(chalk.blue(`i screenshotted ${done}/${length}`));
					console.info(JSON.stringify(log, null, '\t'));
				}

				if (done >= length) {
					await browser.close();
					yay(log);
				}
			}
		});
		Promise.all([
			page.setViewport({ width: 1280, height: 720 }),
			page.goto(url),
		]).then(() => {
			if (isCmd) console.info(chalk.blue(`i Website open – wait for yt`));
		});
	});
};

const cmd = async () => {
	const url = await startServer();
	console.info(chalk.blue(`i Server started`));
	const info = await takeScreenshot(url);
	console.info(chalk.blue(`✔ Screenshot taken`));
	console.info(JSON.stringify(info, null, '\t'));
};

if (isCmd)
	cmd().then(() => {
		process.exit();
	});

module.exports = cmd;
