import { gitSchema, type RawContributor } from '@/lib/git-schema';
import { countCommitsAmount } from './count-commits-amount';

export function parseCSV(csv: string) {
	const parts = csv.split(',');
	const repo = parts[0]; // Repository name
	const splittedData = csv.split('|').slice(1);

	const branches: { n: string; co: RawContributor[] }[] = [];
	let currentBranch: { n: string; co: RawContributor[] } | null = null;
	let currentContributor: RawContributor | null = null;

	// Numeric flags
	// (0 = init, 23 = finish)
	let commitsPerHourIndex = 0;
	// (0 = init, 11 = finish)
	let commitsPerMonthIndex = 0;

	let commitsPerHour: Record<string, number> | null = null;
	let commitsPerMonth: Record<string, number> | null = null;

	splittedData.forEach((data) => {
		const items = data.split(',').filter(Boolean); // Remove empty values

		// Si tenemos un solo elemento en items, se trata de:
		// A - Una nueva rama del repositorio
		// B - El valor de cuantos commits hizo en cierta hora o mes

		// Si tenemos 5 elemtos en items, se trata de un nuevo contribuidor

		if (items.length === 1) {
			// Comienzo de una nueva rama
			if (items[0].startsWith('b-')) {
				// Push last contributor before switching branches
				if (currentContributor) {
					currentContributor.c.cph = commitsPerHour!;
					currentContributor.c.cpm = commitsPerMonth!;
					currentContributor.c.a = countCommitsAmount(commitsPerMonth!);
					currentBranch?.co.push(currentContributor);
					currentContributor = null; // Reset current contributor
				}

				// Push previous branch if exists
				if (currentBranch) {
					branches.push(currentBranch);
				}

				// Create new branch
				currentBranch = { n: items[0].replace('b-', ''), co: [] };

				commitsPerHour = null;
				commitsPerMonth = null;
				commitsPerHourIndex = 0;
				commitsPerMonthIndex = 0;
			} else if (commitsPerHourIndex < 24) {
				// Fix: should go up to 24, not 23
				// Create the object only once
				if (!commitsPerHour) {
					commitsPerHour = Object.fromEntries(
						Array.from({ length: 24 }, (_, i) => [i.toString(), 0]),
					);
				}

				commitsPerHour[commitsPerHourIndex] = Number(items[0]);
				commitsPerHourIndex++;
			} else if (commitsPerMonthIndex < 12) {
				// Fix: should go up to 12, not unbounded
				// Create the object only once
				if (!commitsPerMonth) {
					commitsPerMonth = Object.fromEntries(
						Array.from({ length: 12 }, (_, i) => [i.toString(), 0]),
					);
				}

				commitsPerMonth[commitsPerMonthIndex] = Number(items[0]);
				commitsPerMonthIndex++;
			}
		} else if (items.length === 5) {
			// Push previous contributor before switching
			if (currentContributor) {
				currentContributor.c.cph = commitsPerHour!;
				currentContributor.c.cpm = commitsPerMonth!;
				currentContributor.c.a = countCommitsAmount(commitsPerMonth!);
				currentBranch?.co.push(currentContributor);

				// Reset indexes
				commitsPerHourIndex = 0;
				commitsPerMonthIndex = 0;
			}

			currentContributor = {
				n: items[0],
				e: items[1],
				loc: Number(items[2]),
				rm: Number(items[3]),
				o: Number(items[4]),
				c: { cph: {}, cpm: {}, a: 0 },
			};
		}
	});

	// Push last contributor and last branch before returning
	if (currentContributor) {
		// @ts-ignore
		currentContributor.c.cph = commitsPerHour!;
		// @ts-ignore
		currentContributor.c.cpm = commitsPerMonth!;
		// @ts-ignore
		currentContributor.c.a = countCommitsAmount(commitsPerMonth!);
		// @ts-ignore
		currentBranch?.co.push(currentContributor);
	}
	if (currentBranch) {
		branches.push(currentBranch);
	}

	const parsedData = { t: repo, b: branches };

	// Validate with Zod
	const result = gitSchema.safeParse(parsedData);
	if (!result.success) {
		console.log(result.error);
		throw new Error('Invalid data');
	}

	console.log(result.data);

	return result.data;
}
