import { writable } from "svelte/store";

export const fixtureData = writable([{r: 0, g: 0, b: 0, addr: 1}, {r: 255, g: 0, b: 0, addr: 2}]);
export const selections = writable({
	viewer: [],
	lists: [],
	console: [],
});