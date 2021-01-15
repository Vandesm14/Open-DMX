<script>
	import { convertToRGB } from './lib.js';
	import { fixtureData, selections } from './stores.js';
	import Fixture from './comps/Fixture.svelte';

	const select = (e) => {
		if (e.target !== e.currentTarget || e.ctrlKey) return;
		$selections.viewer = [];
		console.log('click event');
	};

	const changeColor = (e) => {
		let rgb = convertToRGB(e.target.value);
		$selections.viewer = $selections.viewer.map(el => {
			return {...el, ...rgb};
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
	<input id="input" data-jscolor="{{value: '#FFDCA3'}}" on:input={changeColor}>
</div>