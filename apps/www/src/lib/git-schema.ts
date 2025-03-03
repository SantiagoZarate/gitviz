import { mergeContributor } from '@/helpers/merge-contributor';
import { z } from 'zod';

const rawContributorSchema = z.object({
	// Name
	n: z.string(),
	// Commits
	c: z.coerce.number(),
	// Email
	e: z.string().email(),
	// Lines of code
	loc: z.coerce.number(),
	// Removed
	rm: z.coerce.number(),
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
				(a, b) => b.commits - a.commits,
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
	commits: number;
	linesOfCode: number;
	removed: number;
	owned: number;
	email: string;
	avatar: string | null;
};
