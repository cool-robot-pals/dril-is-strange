const express = require('express');
const path = require('path');
const app = express();
const fetch = require('./fetch');

app.use(express.static('web'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../web/index.html'));
});
app.get('/make', async (req, res) => {
	try {
		res.json(await fetch());
	} catch (e) {
		console.error(e);
		res.status(500).send('Something broke!');
	}
});

module.exports = app;
