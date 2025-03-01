import { z } from 'zod';

export const gitSchema = z
	.object({
		// Contributors
		co: z.array(
			z.object({
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
			}),
		),
		// Github repo name
		t: z.string(),
		// Branch name
		b: z.string(),
	})
	.transform(({ co, t, b }) => ({
		contributors: co.map(({ n, c, e, loc, rm, o }) => ({
			name: n,
			commits: c,
			email: e,
			linesOfCode: loc,
			removed: rm,
			owned: o,
		})),
		repoName: t,
		branch: b,
	}));

export type GitSchema = z.infer<typeof gitSchema>;

export type Contributor = GitSchema['contributors'][number];
