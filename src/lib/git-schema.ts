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
			}),
		),
		// Github repo name
		t: z.string(),
	})
	.transform(({ co, t }) => ({
		contributors: co.map(({ n, c, e, loc, rm }) => ({
			name: n,
			commits: c,
			email: e,
			linesOfCode: loc,
			removed: rm,
		})),
		repoName: t,
	}));

export type GitSchema = z.infer<typeof gitSchema>;

export type Contributor = GitSchema['contributors'][number];
