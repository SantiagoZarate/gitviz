import { format, formatDistanceToNow, fromUnixTime, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatCommitDate(unixTime: string) {
	const rawDate = fromUnixTime(Number(unixTime))
		.toISOString()
		.replace('T', ' ')
		.replace('.', ' ')
		.replace('000Z', '-0300');

	// Parse the date string
	const parsedDate = parse(rawDate, 'yyyy-MM-dd HH:mm:ss X', new Date());

	// Format: "YYYY / MM / DD"
	const formattedDate = format(parsedDate, 'yyyy / MM / dd');

	// Get relative time: "(2 days ago)"
	const relativeTime = formatDistanceToNow(parsedDate, {
		addSuffix: true,
		locale: enUS,
	});

	// Final output
	return `${formattedDate} - (${relativeTime})`;
}
