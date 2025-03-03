import type { Contributor, RawContributor } from '@/lib/git-schema';

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
			existing.commits = [
				...existing.commits,
				...c.c.map((commit) => ({
					date: commit.d,
					linesOfCode: commit.loc,
					removed: commit.rm,
				})),
			];
			existing.owned += c.o;
		} else {
			// Agregarlo
			aux.set(c.e, {
				commits: c.c.map((commit) => ({
					date: commit.d,
					linesOfCode: commit.loc,
					removed: commit.rm,
				})),
				email: c.e,
				owned: c.o,
				name: [c.n],
			});
		}
	});

	return Array.from(aux.values());
}
