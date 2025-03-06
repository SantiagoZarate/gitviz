export function convertIsoToUnix(isoDate: string): number {
	const date = new Date(isoDate);
	const unixTimestamp = Math.floor(date.getTime() / 1000);
	return unixTimestamp;
}
