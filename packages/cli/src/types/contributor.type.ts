import type { Commit } from './commit.type';

export interface Contributor {
	n: string;
	e: string;
	c: Commit[];
	o: number;
	loc: number;
	rm: number;
}
