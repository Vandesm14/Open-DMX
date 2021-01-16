<script>
	import { convertToRGB, convertToHex } from './lib.js';
	import { fixtureData, selection } from './stores.js';
	import Fixture from './comps/Fixture.svelte';
	import hotkeys from 'hotkeys-js';

	class FixtureItem {
		constructor() {
			this.id = (() => ($fixtureData[$fixtureData.length - 1]?.id + 1) || 0)();
			this.id_static = (() => ($fixtureData[$fixtureData.length - 1]?.id + 1) || 0)();
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

	const selectSameColor = () => {
		if ($selection.last?.from === 'fixture') {
			let last = $fixtureData[$selection.last.id];
			$fixtureData = $fixtureData.map(el => {
				if (last.r === el.r && last.g === el.g && last.b === el.b) {
					return {...el, selected: true};
				} else {
					return {...el, selected: false};
				}
			});
		}
	};

	const selectAll = () => {
		$fixtureData = $fixtureData.map(el => {
			return {...el, selected: true};
		});
	};

	const selectNone = () => {
		$fixtureData = $fixtureData.map(el => {
			return {...el, selected: false};
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
		} else if ($selection.last.id > 0) {
			if ($fixtureData.length > 0) {
				$fixtureData[0].selected = true;
				$selection.last = {from: 'fixture', id: 0};
			}
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
		} else if ($selection.last.id < $fixtureData.length - 1) {
			if ($fixtureData.length > 0) {
				$fixtureData[0].selected = true;
				$selection.last = {from: 'fixture', id: 0};
			}
		}
	};

	const darkenAll = () => {
		$fixtureData = $fixtureData.map(el => {
			return {...el, r: 0, g: 0, b: 0};
		});
	};

	const darkenSelected = (e) => {
		e.preventDefault();
		$fixtureData = $fixtureData.map(el => {
			if (el.selected) {
				return {...el, r: 0, g: 0, b: 0};
			} else {
				return {...el};
			}
		});
	};

	hotkeys('backspace', darkenSelected);
	hotkeys('delete', removeFixture);
	hotkeys('ctrl+a', selectAll);
	hotkeys('escape', selectNone);
	hotkeys('ctrl+c', copyColor);
	hotkeys('ctrl+v', pasteColor);
	hotkeys('left,ctrl+left,shift+left', prev);
	hotkeys('right,ctrl+right,shift+right', next);

	let lastLength = 0;
	fixtureData.subscribe(() => {
		if ($fixtureData.length !== lastLength) {
			for (let i = 0; i < $fixtureData.length; i++) {
				if ($fixtureData[i].id !== i) $fixtureData[i].id = i;
			}
			lastLength = $fixtureData.length;
		}
	});

	let picker;
	$: {
		if ($selection.last?.from === 'fixture') {
			let last = $fixtureData[$selection.last.id];
			if (last)	picker?.jscolor.fromRGBA(last.r, last.g, last.b, 1)
		}
	};

	for (let i = 0; i < 10; i++) {
		addFixture();
	}
</script>

<style>
	div {
		display: flex;
		align-content: start;
		flex-direction: row;
		width: 100%;
	}

	div#viewer {
		flex-wrap: wrap;
		justify-content: center;
		height: 100%;
	}

	div#controls {
		margin-bottom: 40vh;
		height: 14%;
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
	<button on:click={selectSameColor}>Select Same Color</button>
	<button on:click={darkenSelected}>Darken Selected</button>
</div>