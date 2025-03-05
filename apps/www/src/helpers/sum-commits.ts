// Suma los commits de una objecto con otro objeto, se usa para hacer
// el merge de contribuidores con el mismo email.
// para sumar commits per hours o commits per month

interface Props {
	commitsA: Record<string, number>;
	commitsB: Record<string, number>;
}

export function sumCommits({
	commitsA,
	commitsB,
}: Props): Record<string, number> {
	const aux: Record<string, number> = {};

	Object.entries(commitsA).forEach(([key, value]) => {
		aux[key] = value + commitsB[key];
	});

	return aux;
}
