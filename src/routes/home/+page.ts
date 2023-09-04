import * as coffeeData from './coffeeData.json';

export function load() {
	return { ...coffeeData };
}
