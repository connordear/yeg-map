<script lang="ts">
	import CoffeeShopCard from '$lib/CoffeeShopCard.svelte';
	import LeafletMap from '$lib/LeafletMap.svelte';

	export let data: { default: import('$lib/types').CoffeeShop[] };
</script>

<main>
	<h1 class="title">YEG-MAP</h1>
	<div style="width: 100%; height: 500px">
		<LeafletMap
			markerLocations={data.default.map((shop) => ({
				...shop,
				latLong: [shop.latitude || 0, shop.longitude || 0]
			}))}
		/>
	</div>
	{#each data.default as shop}
		<CoffeeShopCard {shop} />
	{/each}
</main>

<style>
	.title {
		text-align: center;
	}
</style>
