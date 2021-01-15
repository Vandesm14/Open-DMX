<script>
	import { fixtureData, selections } from './stores.js';
	import Fixture from './comps/Fixture.svelte';

	const select = (e) => {
		if (e.target !== e.currentTarget) return;
		$selections.viewer = [];
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