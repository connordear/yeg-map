import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load(loadConfig) {
	if (loadConfig.url.pathname === '/') {
		throw redirect(307, '/home');
	}
}
