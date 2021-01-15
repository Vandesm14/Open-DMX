<script>
	import { fixtureData, selections } from '../stores.js';
	
	export let fixture = {};
	export let selected = false;

	const select = (e) => {
		if (!e.ctrlKey) {
			if (!selected) {
				$selections.viewer = [fixture];
			} else {
				$selections.viewer.splice($selections.viewer.indexOf(fixture), 1);
			}
		} else {
			if (!selected) {
				$selections.viewer = [...$selections.viewer, fixture];
			} else {
				$selections.viewer.splice($selections.viewer.indexOf(fixture), 1);
			}
		}
	};
</script>

<style>
	div {
		border: 5px solid #1f1f1f;
		background-color: black;
		width: 60px;
		height: 60px;
		margin: 10px;
	}

	div.selected {
		border: 3px solid #ffd900;
	}
</style>

<div on:click={select} class={$selections.viewer.includes(fixture) ? 'selected' : ''} style="background-color: rgb({fixture.r}, {fixture.g}, {fixture.b})"></div>