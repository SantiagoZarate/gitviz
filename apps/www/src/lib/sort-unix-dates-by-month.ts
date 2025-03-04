import { format } from 'date-fns';

export function countByMonth(dates: number[]) {
	const monthCounts: { [key: string]: number } = {};

	dates.forEach((unix) => {
		const month = format(new Date(unix * 1000), 'MMMM'); // Convert to full month name

		// Increment count
		monthCounts[month] = (monthCounts[month] || 0) + 1;
	});

	return monthCounts;
}
