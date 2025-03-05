import type { Contributor } from '../../types/contributor.type';

export function updateContributorCommits(
	contributor: Contributor,
	isoDate: string,
) {
	// Parse the date
	const date = new Date(isoDate);

	// Extract hour and month
	const hour = date.getUTCHours(); // Get the hour in UTC
	const month = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
		.toString()
		.padStart(2, '0')}`; // Format YYYY-MM

	// Increment commits per hour
	contributor.c.cph[hour] = (contributor.c.cph[hour] || 0) + 1;

	// Increment commits per month
	contributor.c.cpm[month] = (contributor.c.cpm[month] || 0) + 1;
}
