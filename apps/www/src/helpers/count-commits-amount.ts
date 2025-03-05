// Cuenta la cantidad de commits a partir de los commits por meses
export function countCommitsAmount(commits: Record<string, number>): number {
	let aux = 0;

	Object.entries(commits).forEach(([_monthIndex, value]) => {
		aux += value;
	});

	return aux;
}
