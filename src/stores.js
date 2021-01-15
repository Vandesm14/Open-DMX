import { writable } from "svelte/store";

export const fixtureData = writable([
	{r: 0, g: 0, b: 0, addr: 1},
	{r: 255, g: 0, b: 0, addr: 2},
	{r: 255, g: 128, b: 0, addr: 3},
	{r: 0, g: 255, b: 0, addr: 4},
	{r: 0, g: 0, b: 255, addr: 5}
]);
export const selections = writable({
	viewer: [],
	lists: [],
	console: [],
});