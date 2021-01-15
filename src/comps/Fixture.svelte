<script>
	import { fixtureData, selection } from '../stores.js';
	
	export let fixture = {};

	const select = (e) => {
		if (!e.ctrlKey) {
			let len = $fixtureData.filter(el => el.selected).length;
			$fixtureData = $fixtureData.map(el => {
				return {...el, selected: false};
			});
			if (!fixture.selected || len > 1) {
				$fixtureData.find(el => el.addr === fixture.addr).selected = true;
			}
		} else {
			fixture.selected = !fixture.selected;
		}
	};
</script>

<style>
	div {
		border: 4px solid #6b6980;
		background-color: black;
		width: 50px;
		height: 50px;
		margin: 10px;
	}

	div.selected {
		outline: 3px solid #ffd900;
	}
</style>

<div on:click={select} class={fixture.selected ? 'selected' : ''} style="background-color: rgb({fixture.r}, {fixture.g}, {fixture.b})"></div>