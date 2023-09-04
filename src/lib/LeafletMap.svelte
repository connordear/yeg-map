<script lang="ts">
	import type { Control, LatLngTuple } from 'leaflet';
	import { onMount } from 'svelte';
	import MapToolbar from './MapToolbar.svelte';
	import MarkerPopup from './MarkerPopup.svelte';
	import { markerLookup } from './markers';
	import type { MapItem } from './types';
	export let markerLocations: MapItem[] = [];
	let L: any;

	let map: L.Map | null;
	let eye = true;
	let markerLayers: L.LayerGroup;
	let markers = new Map();
	let lineLayers: L.Polyline;
	const initialView: LatLngTuple = [53.5461, -113.4937];
	let toolbar: Control;

	let toolbarComponent: MapToolbar | null = null;

	onMount(async () => {
		const leafletModule = await import('leaflet');
		L = leafletModule.default;
		toolbar = L.control({ position: 'topright' });
		toolbar.onAdd = (map: L.Map) => {
			let div = L.DomUtil.create('div');
			toolbarComponent = new MapToolbar({
				target: div,
				props: {}
			});

			toolbarComponent.$on('click-eye', ({ detail }) => (eye = detail));
			toolbarComponent.$on('click-reset', () => {
				map.setView(initialView, 5, { animate: true });
			});

			return div;
		};

		toolbar.onRemove = () => {
			if (toolbarComponent) {
				toolbarComponent.$destroy();
				toolbarComponent = null;
			}
		};
		mapAction(document.getElementsByClassName('map')[0] as HTMLElement);
		// map = createMap(document.getElementsByClassName('map')[0]);
		// console.log(map);
	});

	function createMap(container: any) {
		console.log(L);
		if (!L) return;
		let m = L.map(container, { preferCanvas: true }).setView(initialView, 12);
		L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
			attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
			subdomains: 'abcd',
			maxZoom: 18
		}).addTo(m);
		// L.geoJSON(coeNbhd.features[0]).addTo(m);

		return m;
	}

	// Create a popup with a Svelte component inside it and handle removal when the popup is torn down.
	// `createFn` will be called whenever the popup is being created, and should create and return the component.
	function bindPopup(marker: L.Marker, createFn: (container: HTMLElement) => MarkerPopup) {
		let popupComponent: MarkerPopup | null;
		marker.bindPopup(() => {
			let container = L.DomUtil.create('div');
			popupComponent = createFn(container);
			return container;
		});

		marker.on('popupclose', () => {
			if (popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				// Wait to destroy until after the fadeout completes.
				setTimeout(() => {
					old.$destroy();
				}, 500);
			}
		});
	}

	function markerIcon(mapItem: MapItem) {
		let html = `<div class="map-marker-${mapItem.type}"><div>${
			markerLookup[mapItem.type]
		}</div></div>`;
		return L.divIcon({
			html,
			className: `map-marker-${mapItem.type}`
		});
	}

	function createMarker(mapItem: MapItem) {
		let count = Math.ceil(Math.random() * 25);
		let icon = markerIcon(mapItem);
		let marker = L.marker(mapItem.latLong, { icon });
		bindPopup(marker, (m) => {
			let c = new MarkerPopup({
				target: m,
				props: {
					mapItem
				}
			});

			c.$on('change', ({ detail }) => {
				count = detail;
				marker.setIcon(markerIcon(mapItem));
			});

			return c;
		});

		return marker;
	}

	// We could do these in the toolbar's click handler but this is an example
	// of modifying the map with reactive syntax.

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
	function mapAction(container: HTMLElement) {
		map = createMap(container);
		console.log(map);
		if (!map) return;
		toolbar.addTo(map);

		markerLayers = L.layerGroup();
		for (let item of markerLocations) {
			let m = createMarker(item);
			markerLayers.addLayer(m);
		}

		markerLayers.addTo(map);

		return {
			destroy: () => {
				toolbar.remove();
				map?.remove();
				map = null;
			}
		};
	}

	$: if (markerLayers && map) {
		if (eye) {
			markerLayers.addTo(map);
		} else {
			markerLayers.remove();
		}
	}
</script>

<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>

<svelte:window on:resize={resizeMap} />

<div class="map" style="height:100%;width:100%" use:mapAction />

<style>
	.map :global(.marker-text) {
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 0.5rem;
		background-color: #444;
		color: #eee;
		border-radius: 0.5rem;
	}

	.map :global(.map-marker-marker) {
		height: 20px;
		transform: translateX(-50%) translateY(-50%);
	}
	.map :global(.map-marker-coffee) {
		width: 20px;
		transform: translateX(-50%) translateY(-50%);
	}
</style>
