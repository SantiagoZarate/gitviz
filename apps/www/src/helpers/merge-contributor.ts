import type { Contributor } from '@/lib/git-schema';

export type ContributorMultiNames = Omit<Contributor, 'name'> & {
	name: string[];
};

export function mergeContributor(
	contributors: Contributor[],
): ContributorMultiNames[] {
	const aux = new Map<string, ContributorMultiNames>();

	contributors.forEach((c) => {
		if (aux.has(c.email)) {
			// Sumar las estadisticas
			const existing = aux.get(c.email)!;
			// if (!existing.name.includes(c.name))
			existing.name.push(c.name);
			existing.commits += c.commits;
			existing.linesOfCode += c.linesOfCode;
			existing.removed += c.removed;
			existing.owned += c.owned;
		} else {
			// Agregarlo
			aux.set(c.email, { ...c, name: [c.name] });
		}
	});

	return Array.from(aux.values());
}
