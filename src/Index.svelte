<script>
	import { convertToRGB } from './lib.js';
	import { fixtureData, selection } from './stores.js';
	import Fixture from './comps/Fixture.svelte';

	const select = (e) => {
		if (e.target !== e.currentTarget || e.ctrlKey) return;
		$fixtureData = $fixtureData.map(el => {
			return {...el, selected: false};
		});
	};

	const changeColor = (e) => {
		$fixtureData = $fixtureData.map(el => {
			if (el.selected) {
				return {...el, ...convertToRGB(e.target.value)};
			} else {
				return el;
			}
		});
	};
</script>

<style>
	div {
		display: flex;
		flex-direction: row;
		height: 100%;
	}
</style>

<div on:click={select}>
	{#each $fixtureData as fixture}
	<Fixture {fixture}></Fixture>
	{/each}
</div>
<div>
	<input id="input" data-jscolor={"{value: '#FF0000'}"} on:input={changeColor}>
</div>