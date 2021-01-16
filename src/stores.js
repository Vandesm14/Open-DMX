import { writable } from "svelte/store";

export const fixtureData = writable([]);
export const selection = writable({
	get last() {
		return this._last;
	},
	set last(obj) {
		this._last = obj;
		console.log('set last', obj);
		if (Object.keys(this.from).includes(obj.from)) {
			console.log('set from', obj);
			this.from[obj.from] = obj;
		}
	},
	_last: {from: null, id: null},
	from: {
		fixture: {id: null}
	},
	copy: {type: null, data: null}
});