const monthsOrdered = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export function mapCommitMonths(data: Record<string, number>) {
	const commitsPerMonth: Record<string, number> = Object.fromEntries(
		Array.from({ length: 12 }, (_, i) => [monthsOrdered[i], 0]),
	);

	Object.entries(data).forEach(([monthIndex, value]) => {
		const index = Number(monthIndex);
		if (index >= 0 && index < 12) {
			commitsPerMonth[monthsOrdered[index]] = value;
		}
	});

	return commitsPerMonth;
}
