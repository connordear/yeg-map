const gappUrl =
	'https://script.google.com/macros/s/AKfycbwHcq7cX3tPpTC_UXCPtdTb2lJzM45Tirm-PMLi_AxZsmcPCxqOJeue1YbwXb7k3OU/exec';
export async function load() {
	const data = await fetch(gappUrl, {
		method: 'GET'
	});
	const vals = await data.json();
	console.log(vals);
	return { default: vals };
}
