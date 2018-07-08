const server = require('../src/express.js');
const config = require('../.hellarc');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');

const outPath = config.paths.screenie;

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

	return new Promise((yay, nay) => {
		page.on('console', async msg => {
			try {
				const log = JSON.parse(msg.text());
				if (log.ready) {
					await page.waitFor(1000); /* prevent black screens, spinner, etc */
					await page.screenshot({ path: outPath, type: 'png' });
					await browser.close();
					yay(log);
				}
			} catch (e) {}
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
	if (isCmd) console.info(chalk.blue(`i Server started`));
	const info = await takeScreenshot(url);
	if (isCmd) console.info(chalk.blue(`✔ Screenshot taken`));
	if (isCmd) console.info(JSON.stringify(info, null, '\t'));
	return info;
};

if (isCmd)
	cmd().then(() => {
		process.exit();
	});

module.exports = cmd;
