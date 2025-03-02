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
			existing.commits += c.c;
			existing.linesOfCode += c.loc;
			existing.removed += c.rm;
			existing.owned += c.o;
		} else {
			// Agregarlo
			aux.set(c.e, {
				commits: c.c,
				email: c.e,
				linesOfCode: c.loc,
				owned: c.o,
				removed: c.rm,
				name: [c.n],
			});
		}
	});

	return Array.from(aux.values());
}
