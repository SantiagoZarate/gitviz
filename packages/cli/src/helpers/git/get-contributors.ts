import { execSync } from 'node:child_process';
import type { Contributor } from '../../types/contributor.type';
import { updateContributorCommits } from './update-contributor-commits';

// Get contributors and their commit stats
export async function getContributors(): Promise<Map<string, Contributor>> {
	const contributors: Map<string, Contributor> = new Map();

	const logOutput = execSync(
		'git log --pretty=format:"|||%n%an <%ae> %ad" --date=iso --shortstat',
		{ encoding: 'utf-8' },
	);

	let currentContributor = '';

	const splittedLog = logOutput.split('|||');

	splittedLog.forEach((line) => {
		const authorMatch = line.match(/(.+) <(.+)> (.+)/);
		if (!authorMatch) {
			return;
		}

		const [, name, email, date] = authorMatch;
		const key = `${name}|${email}`;

		if (!contributors.has(key)) {
			const commitsPerHour: Record<string, number> = Object.fromEntries(
				Array.from({ length: 24 }, (_, i) => [i.toString(), 0]),
			);

			const commitsPerMonth: Record<string, number> = Object.fromEntries(
				Array.from({ length: 12 }, (_, i) => [i.toString(), 0]),
			);

			contributors.set(key, {
				n: name,
				e: email,
				c: { cph: commitsPerHour, cpm: commitsPerMonth, f: date, l: '' },
				o: 0,
				loc: 0,
				rm: 0,
			});
		}

		currentContributor = key;
		const contributor = contributors.get(key)!;

		updateContributorCommits(contributor, date);

		// Update last commit always
		contributor.c.l = date;

		if (currentContributor) {
			const { deletions, insertions } = extractChanges(line);
			contributor.loc += insertions;
			contributor.rm += deletions;
		}
	});

	return contributors;
}

const extractChanges = (line: string) => {
	const locMatch = line.match(/(\d+) insertions?\(\+\)/);
	const rmMatch = line.match(/(\d+) deletions?\(-\)/);

	const insertions = locMatch ? Number.parseInt(locMatch[1], 10) : 0;
	const deletions = rmMatch ? Number.parseInt(rmMatch[1], 10) : 0;

	return { insertions, deletions };
};
