import { gitSchema, type RawContributor } from '@/lib/git-schema';

export function parseCSV(csv: string) {
	const parts = csv.split(',');
	const repo = parts[0]; // Repository name
	const branch = parts[1]; // Branch name
	const contributorsRaw = csv.split('|').slice(1); // Extract contributors

	let currentContributor: RawContributor | null = null;

	const contributors: RawContributor[] = [];

	contributorsRaw.forEach((contrib) => {
		const data = contrib.split(',');
		console.log({ data });

		// En ambos casos, la utlima posicion del array esta vacio.

		// Si el arrey tiene 6 elementos, estamos al inicio de un nuevo contribuidor
		if (data.length === 6) {
			if (currentContributor) {
				contributors.push(currentContributor);
			}

			currentContributor = {
				n: data[0],
				e: data[1],
				loc: Number(data[2]),
				rm: Number(data[3]),
				o: Number(data[4]),
				c: [],
			};
		} else if (data.length) {
			const [date] = data;
			currentContributor!.c.push({ d: Number(date) });
		}
	});

	if (currentContributor) {
		contributors.push(currentContributor);
	}

	const parsedData = { t: repo, b: [{ n: branch, co: contributors }] };

	// Validate with Zod
	const result = gitSchema.safeParse(parsedData);
	if (!result.success) {
		console.log(result.error);
		throw new Error('Invalid data');
	}

	return result.data;
}
