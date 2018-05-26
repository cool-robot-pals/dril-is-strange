const randomArrKey = items => items[Math.floor(Math.random() * items.length)];

const txtToArr = txt => txt.split('\n').filter(_ => _ != '');

const pad = n => (n < 10 ? '0' + n : n);

const capitalizeFirstLetter = string =>
	string.charAt(0).toUpperCase() + string.slice(1);

module.exports = { randomArrKey, txtToArr, pad, capitalizeFirstLetter };
