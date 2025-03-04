import type { Branch } from '../types/branch.type';

interface RawJson {
	t: string;
	b: Branch[];
}

export function jsonToCsv(json: RawJson) {
	const { t, b } = json;

	let csv = `${t},`;

	b.forEach(({ n, co }) => {
		let branchCsv = `b-${n},`;

		co.forEach(({ n, e, c, o, loc, rm }) => {
			let commitDates = '';
			c.forEach(({ d }) => {
				commitDates += `|${d},`;
			});
			branchCsv += `|${n},${e},${o},${loc},${rm},${commitDates}`;
		});

		csv += `|${branchCsv}`;
	});

	return csv;
}
