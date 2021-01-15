<script>
	import { fixtureData, selections } from '../stores.js';
	
	export let fixture = {};
	$: selected = $selections.viewer.includes(fixture);

	const select = (e) => {
		if (!e.ctrlKey) {
			if (!selected) {
				$selections.viewer = [fixture];
			} else {
				if ($selections.viewer.length > 1) {
					$selections.viewer = [fixture];
				} else {
					$selections.viewer = [];
				}
			}
		} else {
			if (!selected) {
				$selections.viewer = [...$selections.viewer, fixture];
			} else {
				$selections.viewer = $selections.viewer.filter(el => el !== fixture);
			}
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

<div on:click={select} class={$selections.viewer.includes(fixture) ? 'selected' : ''} style="background-color: rgb({fixture.r}, {fixture.g}, {fixture.b})"></div>