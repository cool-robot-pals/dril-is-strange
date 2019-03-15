const randomArrKey = items => items[Math.floor(Math.random() * items.length)];

const pad = n => (n < 10 ? '0' + n : n);

const capitalizeFirstLetter = string =>
	string.charAt(0).toUpperCase() + string.slice(1);

const shuffle = o => {
	for (
		var j, x, i = o.length;
		i;
		j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
	);
	return o;
};

module.exports = { randomArrKey, pad, shuffle, capitalizeFirstLetter };
