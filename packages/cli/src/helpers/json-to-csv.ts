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
			Object.entries(c.cph).map(([hour, value]) => {
				commitDates += `|${value},`;
			});
			Object.entries(c.cpm).map(([month, value]) => {
				commitDates += `|${value},`;
			});
			branchCsv += `|${n},${e},${o},${loc},${rm},${commitDates}`;
		});

		csv += `|${branchCsv}`;
	});

	return csv;
}
