<!-- Coffee Shop display Card -->

<script lang="ts">
	export let shop: import('$lib/types').CoffeeShop;
</script>

<main>
	<div class="card">
		<div class="card-content">
			<div class="content">
				<h3>{shop.name}</h3>
				<p>{shop.city}</p>
				<p>{shop.coffeeServed}</p>
				<p>{shop.latitude}</p>
				<p>{shop.longitude}</p>
			</div>
		</div>
	</div>
</main>
