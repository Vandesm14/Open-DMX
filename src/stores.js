import { writable } from "svelte/store";

export const fixtureData = writable([
	{r: 0, g: 0, b: 0, addr: 0},
	{r: 255, g: 0, b: 0, addr: 1},
	{r: 255, g: 128, b: 0, addr: 2},
	{r: 0, g: 255, b: 0, addr: 3},
	{r: 0, g: 0, b: 255, addr: 4}
]);
export const selection = writable({
	last: null
});