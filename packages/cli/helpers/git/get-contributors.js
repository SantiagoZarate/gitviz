import { execSync } from 'node:child_process';

// Get contributors and their commit stats
export async function getContributors() {
	const contributors = new Map();

	const logOutput = execSync(
		'git log --pretty=format:"|||%n%an <%ae> %ad" --date=unix --shortstat',
		{ encoding: 'utf-8' },
	);

	let currentContributor;

	const splittedLog = logOutput.split('|||');

	splittedLog.forEach((line) => {
		console.log({ line });
		const authorMatch = line.match(/(.+) <(.+)> (.+)/);
		if (!authorMatch) {
			return;
		}

		const [, name, email, date] = authorMatch;
		const key = `${name}|${email}`;

		if (!contributors.has(key)) {
			contributors.set(key, {
				n: name,
				e: email,
				c: [],
				o: 0,
				loc: 0,
				rm: 0,
			});
		}

		currentContributor = key;
		const contributor = contributors.get(key);

		const commit = {
			d: date,
		};

		if (currentContributor) {
			const { deletions, insertions } = extractChanges(line);
			contributor.loc += insertions;
			contributor.rm += deletions;
		}

		contributor.c.push(commit);
	});

	return contributors;
}

const extractChanges = (line) => {
	const locMatch = line.match(/(\d+) insertions?\(\+\)/);
	const rmMatch = line.match(/(\d+) deletions?\(-\)/);

	const insertions = locMatch ? Number.parseInt(locMatch[1], 10) : 0;
	const deletions = rmMatch ? Number.parseInt(rmMatch[1], 10) : 0;

	return { insertions, deletions };
};
