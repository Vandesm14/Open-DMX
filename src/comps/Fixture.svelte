<script>
	import { fixtureData, selection } from '../stores.js';
	
	export let fixture = {};

	const select = (e) => {
		let last = $selection.last?.id;
		if (e.ctrlKey) {
			fixture.selected = !fixture.selected;
		} else if (e.shiftKey) {
			if (last !== null) {
				if (fixture.id >= last) {
					for (let i = last; i <= fixture.id; i++) {
						$fixtureData[i].selected = true;
					}
				} else {
					for (let i = last; i >= fixture.id; i--) {
						$fixtureData[i].selected = true;
					}
				}
			}
		} else {
			let len = $fixtureData.filter(el => el.selected).length;
			$fixtureData = $fixtureData.map(el => {
				return {...el, selected: false};
			});
			if (!fixture.selected || len > 1) {
				$fixtureData.find(el => el.id === fixture.id).selected = true;
			}
		}
		$selection.last = {from: 'fixture', id: fixture.id};
	};
</script>

<style>
	div.fixture {
		width: 50px;
		height: 50px;
		border: 4px solid #6b6980;
		background-color: black;
	}
	div.fixture.selected {
		outline: 3px solid #ffd900;
	}

	div.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 10px;
		color: white;
		text-align: center;
	}

	div.container > p {
		overflow: hidden;
		padding-top: 3px;
		max-width: 50px;

		user-select: none;
	}
</style>

<div class="container">
	<div on:click={select} class={'fixture'+(fixture.selected ? ' selected' : '')} style="background-color: rgb({fixture.r}, {fixture.g}, {fixture.b})"></div>
	<p>{fixture.id_static}</p>
</div>