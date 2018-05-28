const server = require('../src/express.js');
const config = require('../.hellarc');
const puppeteer = require('puppeteer');
const path = require('path');

const outPath = config.paths.screenie;

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
					await page.waitFor(8000); /* yt speed */
					await page.screenshot({ path: outPath, type: 'png' });
					await browser.close();
					yay(log);
				}
			} catch (e) {}
		});
		Promise.all([
			page.setViewport({ width: 1280, height: 720 }),
			page.goto(url),
		]);
	});
};

const cmd = async () => startServer().then(url => takeScreenshot(url));

if (!module.parent)
	cmd().then(() => {
		process.exit();
	});

module.exports = cmd;
