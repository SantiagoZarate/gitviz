export function jsonToCsv(json) {
	const { t, b } = json;

	let csv = `${t},`;

	b.forEach(({ n, co }) => {
		let branchCsv = `${n},`;

		co.forEach(({ n, e, c, o, loc, rm }) => {
			let commitDates;
			c.forEach(({ d }) => {
				commitDates += `|${d},`;
			});
			branchCsv += `|${n},${e},${o},${loc},${rm},${commitDates}`;
		});

		csv += `${branchCsv}`;
	});

	return csv;
}
