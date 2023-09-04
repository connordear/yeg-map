import type { LatLngExpression } from 'leaflet';

export interface Location extends LatLong {
	stateProv: string;
	city: string;
	region: string;
	address: string;
	longitude: number;
	latitude: number;
}

export interface Website {
	url: string;
}

export interface LatLong {
	latLong: LatLngExpression;
}

export interface Name {
	name: string;
}

export interface CoffeeShop extends Name, Location, Website {
	coffeeServed: string[];
}
