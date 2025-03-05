import type { Contributor, RawContributor } from '@/lib/git-schema';
import { sumCommits } from './sum-commits';

export function mergeContributor(
	contributors: RawContributor[],
): Contributor[] {
	const aux = new Map<string, Contributor>();

	contributors.forEach((c) => {
		if (aux.has(c.e)) {
			// Sumar las estadisticas
			const existing = aux.get(c.e)!;
			// if (!existing.name.includes(c.name))
			existing.name.push(c.n);
			existing.commits.commitsPerHour = sumCommits({
				commitsA: existing.commits.commitsPerHour,
				commitsB: c.c.cph,
			});
			existing.commits.commitsPerMonth = sumCommits({
				commitsA: existing.commits.commitsPerMonth,
				commitsB: c.c.cpm,
			});
			existing.commits.amount += c.c.a;
			existing.owned += c.o;
		} else {
			// Agregarlo
			aux.set(c.e, {
				commits: {
					commitsPerHour: c.c.cph,
					commitsPerMonth: c.c.cpm,
					amount: c.c.a,
				},
				linesOfCode: c.loc,
				removed: c.rm,
				email: c.e,
				owned: c.o,
				name: [c.n],
			});
		}
	});

	return Array.from(aux.values());
}
