import { format, formatDistanceToNow, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatCommitDate(rawDate: string) {
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
