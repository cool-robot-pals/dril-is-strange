const randomArrKey = items => items[Math.floor(Math.random() * items.length)];

const txtToArr = txt => txt.split('\n').filter(_ => _ != '');

module.exports = { randomArrKey, txtToArr };
