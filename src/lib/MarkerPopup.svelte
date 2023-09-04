<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { MapItem } from './types';
	const dispatch = createEventDispatcher();

	export let mapItem: MapItem;
</script>

<div>
	<h2>{mapItem.name}</h2>
</div>

<div style="width:100%;text-align:center;font-weight:600">
	{mapItem.latLong}
</div>

<style>
	button {
		width: 2rem;
	}
</style>
