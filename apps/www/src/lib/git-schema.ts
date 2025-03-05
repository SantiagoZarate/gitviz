import { mergeContributor } from '@/helpers/merge-contributor';
import { z } from 'zod';

const commitSchema = z.object({
	// commits per hour
	cph: z.record(z.coerce.number()),
	// commits per month
	cpm: z.record(z.coerce.number()), // Another dynamic object for months
	// amount
	a: z.coerce.number(),
});

const rawContributorSchema = z.object({
	// Name
	n: z.string(),
	// Commits
	c: commitSchema,
	// Lines of code
	loc: z.coerce.number(),
	// Removed
	rm: z.coerce.number(),
	// Email
	e: z.string(),
	// Owned
	o: z.coerce.number(),
});

export type RawContributor = z.infer<typeof rawContributorSchema>;

export const gitSchema = z
	.object({
		// Github repo name
		t: z.string(),
		// Branchs
		b: z.array(
			z.object({
				// Branch name
				n: z.string(),
				// Contributors
				co: z.array(rawContributorSchema),
			}),
		),
	})
	.transform(({ t, b }) => ({
		repoName: t,
		branchs: b.map(({ co, n }) => {
			// Merge contributors with same email and sort by commits
			const contributors = mergeContributor(co).sort(
				(a, b) => b.commits.amount - a.commits.amount,
			);

			return {
				name: n,
				contributors,
			};
		}),
	}));

export type GitSchema = z.infer<typeof gitSchema>;

export type Branch = GitSchema['branchs'][number];

export type Contributor = {
	name: string[];
	commits: {
		commitsPerHour: {
			[key: string]: number;
		};
		commitsPerMonth: {
			[key: string]: number;
		};
		amount: number;
	};
	linesOfCode: number;
	removed: number;
	owned: number;
	email: string;
	avatar?: string | null;
};
