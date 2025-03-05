import { fromUnixTime, getHours } from 'date-fns';

export function getCommitsPerHour(commits: number[]) {
	const commitsPerHour: Record<string, number> = Object.fromEntries(
		Array.from({ length: 24 }, (_, i) => [i.toString(), 0]),
	);

	commits.forEach((timestamp) => {
		const hour = getHours(fromUnixTime(timestamp));
		commitsPerHour[hour.toString()]++;
	});

	return commitsPerHour;
}
