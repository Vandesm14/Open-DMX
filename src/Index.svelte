<script>
	import { convertToRGB, convertToHex } from './lib.js';
	import { fixtureData, selection } from './stores.js';
	import Fixture from './comps/Fixture.svelte';
	import hotkeys from 'hotkeys-js';

	class FixtureItem {
		constructor() {
			this.id = (() => ($fixtureData[$fixtureData.length - 1]?.id + 1) || 0)();
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

	const copyColor = () => {
		if ($selection.last?.from === 'fixture') {
			let last = $fixtureData[$selection.last.id];
			$selection.copy = {type: 'color', data: convertToHex(last.r, last.g, last.b)};
		}
	};

	const pasteColor = () => {
		if ($selection.copy?.type === 'color' && $selection.copy.data) {
			$fixtureData = $fixtureData.map(el => {
				if (el.selected) {
					return {...el, ...convertToRGB($selection.copy.data)};
				} else {
					return el;
				}
			});
		}
	};

	const prev = (e) => {
		if ($selection.last?.from === 'fixture' && $selection.last.id > 0) {
			$fixtureData = $fixtureData.map((el, i) => {
				if (i === $selection.last.id - 1) {
					return {...el, selected: true};
				} else if (e.ctrlKey || e.shiftKey) {
					return {...el};
				} else {
					return {...el, selected: false};
				}
			});
			$selection.last = {from: 'fixture', id: $selection.last.id - 1};
		}
	};

	const next = (e) => {
		if ($selection.last?.from === 'fixture' && $selection.last.id < $fixtureData.length - 1) {
			$fixtureData = $fixtureData.map((el, i) => {
				if (i === $selection.last.id + 1) {
					return {...el, selected: true};
				} else if (e.ctrlKey || e.shiftKey) {
					return {...el};
				} else {
					return {...el, selected: false};
				}
			});
			$selection.last = {from: 'fixture', id: $selection.last.id + 1};
		}
	};

	hotkeys('ctrl+a', selectAll);
	hotkeys('ctrl+c', copyColor);
	hotkeys('ctrl+v', pasteColor);
	hotkeys('left,ctrl+left,shift+left', prev);
	hotkeys('right,ctrl+right,shift+right', next);

	let picker;
	$: {
		if ($selection.last?.from === 'fixture') {
			let last = $fixtureData[$selection.last.id];
			picker?.jscolor.fromRGBA(last.r, last.g, last.b, 1)
		}
	};
</script>

<style>
	div {
		display: flex;
		align-content: start;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
	}

	div#controls {
		margin-bottom: 40vh;
		height: 14%;
		flex-wrap: nowrap;
	}
</style>

<div on:click={select} id="viewer">
	{#each $fixtureData as fixture}
	<Fixture {fixture}></Fixture>
	{/each}
</div>
<div id="controls">
	<input id="input" data-jscolor="" bind:this={picker} on:input={changeColor}>
	<button on:click={addFixture}>Add Fixture</button>
	<button on:click={removeFixture}>Remove Selected</button>
	<button on:click={selectAll}>Select All</button>
	<button on:click={copyColor}>Copy Color</button>
	<button on:click={pasteColor}>Paste Color</button>
</div>