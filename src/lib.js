import { fixtureData } from './stores.js';

export const convertToRGB = function (str) {
	let aRgbHex = str.replace('#', '').match(/.{1,2}/g);
	let aRgb = {
		r: parseInt(aRgbHex[0], 16),
		g: parseInt(aRgbHex[1], 16),
		b: parseInt(aRgbHex[2], 16)
	};
	return aRgb;
};