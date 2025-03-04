import { gitSchema, type RawContributor } from '@/lib/git-schema';

export function parseCSV(csv: string) {
	const parts = csv.split(',');
	const repo = parts[0]; // Repository name
	const splittedData = csv.split('|').slice(1);

	const branches: { n: string; co: RawContributor[] }[] = [];
	let currentBranch: { n: string; co: RawContributor[] } | null = null;
	let currentContributor: RawContributor | null = null;

	splittedData.forEach((data) => {
		const items = data.split(',').filter(Boolean); // Remove empty values

		// SI TIENE UN ELEMENTO HAY DOS OPCIONES.
		// -- El primer elemento empieza con "b-" indicando que es una nueva rama
		// -- El primer elemento es una fecha en unix

		// SI TIENE CINCO ELEMENTOS ES UN NUEVO CONTRIBUIDOR

		if (items.length === 1) {
			// Comienzo de una nueva rama
			if (items[0].startsWith('b-')) {
				// Push last contributor before switching branches
				if (currentContributor) {
					currentBranch?.co.push(currentContributor);
					currentContributor = null;
				}

				// Push previous branch if exists
				if (currentBranch) {
					branches.push(currentBranch);
				}

				// Create new branch
				currentBranch = { n: items[0].replace('b-', ''), co: [] };
			} else {
				// Fecha de un commit
				if (currentContributor) {
					currentContributor.c.push({ d: Number(items[0]) });
				}
			}
		} else if (items.length === 5) {
			console.log('NUEVO CONTRIBUIDOR');
			console.log({ items });

			// Push previous contributor before switching
			if (currentContributor) {
				currentBranch?.co.push(currentContributor);
			}

			currentContributor = {
				n: items[0],
				e: items[1],
				loc: Number(items[2]),
				rm: Number(items[3]),
				o: Number(items[4]),
				c: [],
			};
		}
	});

	// Push last contributor and last branch before returning
	if (currentContributor) {
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

	return result.data;
}
