#!/usr/bin/env node

import LZString from 'lz-string';
import childProccess from 'node:child_process';
import path from 'node:path';
import open from 'open';
import simpleGit from 'simple-git';

const git = simpleGit();

// Get repository name from the folder name
const getRepoName = () => {
	return path.basename(process.cwd());
};

// Get current branch name
const getBranch = async () => {
	return (await git.revparse(['--abbrev-ref', 'HEAD'])).trim();
};

// Get contributors and their stats
const getContributors = async () => {
	const contributors = new Map();

	// Get all commits with author and stats
	const logOutput = childProccess.execSync(
		'git log --pretty=format:"%an <%ae>" --shortstat',
		{ encoding: 'utf-8' },
	);

	let currentContributor;

	logOutput.split('\n').forEach((line) => {
		const authorMatch = line.match(/(.+) <(.+)>/);
		if (authorMatch) {
			const [, name, email] = authorMatch;
			const key = `${name}|${email}`;

			if (!contributors.has(key)) {
				contributors.set(key, { n: name, e: email, c: 0, loc: 0, rm: 0 });
			}
			currentContributor = key;
			contributors.get(key).c += 1;
		} else if (currentContributor && line.includes('file changed')) {
			const locMatch = line.match(/(\d+) insertions?/);
			const rmMatch = line.match(/(\d+) deletions?/);

			if (locMatch)
				contributors.get(currentContributor).loc += Number.parseInt(
					locMatch[1],
				);
			if (rmMatch)
				contributors.get(currentContributor).rm += Number.parseInt(rmMatch[1]);
		}
	});

	return Array.from(contributors.values());
};

// Main function to gather Git stats
export const getGitStats = async () => {
	const [repoName, branch, contributors] = await Promise.all([
		getRepoName(),
		getBranch(),
		getContributors(),
	]);

	const data = {
		co: contributors,
		t: repoName,
		b: branch,
	};

	const compressed = LZString.compressToEncodedURIComponent(
		JSON.stringify(data),
	);

	const url = `http://localhost:5173/?q=${compressed}`;

	await open(url);

	return data;
};

// Execute and log result
getGitStats().then(console.log).catch(console.error);
