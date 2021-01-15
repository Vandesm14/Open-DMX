<script>
	import { convertToRGB } from './lib.js';
	import { fixtureData, selection } from './stores.js';
	import Fixture from './comps/Fixture.svelte';

	class FixtureItem {
		constructor() {
			this.id = (() => $fixtureData[$fixtureData.length - 1].id + 1)();
			this.r = 0;
			this.g = 0;
			this.b = 0;
		}
	}

	const select = (e) => {
		if (e.target !== e.currentTarget || e.ctrlKey) return;
		$fixtureData = $fixtureData.map(el => {
			return {...el, selected: false};
		});
		$selection.last = {from: 'veiwer', id: null};
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

	const addFixture = () => {
		$fixtureData = [...$fixtureData, new FixtureItem()];
	};
	
	const removeFixture = () => {
		$fixtureData = $fixtureData.filter(el => !el.selected);
	};

	const selectAll = () => {
		$fixtureData = $fixtureData.map(el => {
			return {...el, selected: true};
		});
	};
</script>

<style>
	div#viewer {
		display: flex;
		flex-direction: row;
		height: 100%;
	}
</style>

<div on:click={select} id="viewer">
	{#each $fixtureData as fixture}
	<Fixture {fixture}></Fixture>
	{/each}
</div>
<div>
	<input id="input" data-jscolor={"{value: '#FF0000'}"} on:input={changeColor}>
	<button on:click={addFixture}>Add Fixture</button>
	<button on:click={removeFixture}>Remove Selected</button>
	<button on:click={selectAll}>Select All</button>
</div>