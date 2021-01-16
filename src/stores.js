import { writable } from "svelte/store";

export const fixtureData = writable([]);
export const selection = writable({
	last: {from: null, id: null},
	copy: {type: null, data: null}
});