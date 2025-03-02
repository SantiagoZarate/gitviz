#!/usr/bin/env node

import LZString from 'lz-string';
import childProcess from 'node:child_process';
import path from 'node:path';
import open from 'open';
import simpleGit from 'simple-git';

const git = simpleGit();

// Get repository root directory
const getRepoRoot = () => {
	return childProcess
		.execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' })
		.trim();
};

// Get repository name from the root folder
const getRepoName = () => path.basename(getRepoRoot());

// Get all branches
const getAllBranches = async () => {
	const branches = await git.branchLocal(['--format="%(refname:short)"']);
	return branches.all.map((branch) => branch.replace(/"/g, '')); // Remove quotes
};

// Get contributors and their commit stats
const getContributors = async () => {
	const contributors = new Map();

	const logOutput = childProcess.execSync(
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
				contributors.set(key, {
					n: name,
					e: email,
					c: 0,
					loc: 0,
					rm: 0,
					o: 0,
				});
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

	return contributors;
};

// Get total lines owned per author using git blame
const getLineOwnership = async (contributors) => {
	const repoRoot = getRepoRoot();
	const blameOutput = childProcess.execSync(
		`git -C "${repoRoot}" ls-tree -r -z --name-only HEAD | while IFS= read -r -d '' file; do git -C "${repoRoot}" blame --line-porcelain "$file" | grep '^author '; done | sort | uniq -c | sort -nr`,
		{ encoding: 'utf-8', shell: '/bin/bash' },
	);

	blameOutput.split('\n').forEach((line) => {
		const match = line.trim().match(/(\d+)\s+author (.+)/);
		if (match) {
			const [, count, name] = match;
			for (const key of contributors.keys()) {
				if (key.startsWith(`${name}|`)) {
					contributors.get(key).o = Number.parseInt(count);
				}
			}
		}
	});
};

// Main function to gather Git stats for all branches
export const getGitStats = async () => {
	const repoName = await getRepoName();
	const branches = await getAllBranches();

	console.log({ branches });
	const branchData = [];

	for (const branch of branches) {
		await git.checkout(branch);
		const contributors = await getContributors();
		await getLineOwnership(contributors);

		branchData.push({
			name: branch,
			co: Array.from(contributors.values()),
		});
	}

	// Restore to the original branch
	const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
	await git.checkout(currentBranch);

	const data = {
		t: repoName,
		b: branchData,
	};

	console.dir(data);

	const compressed = LZString.compressToEncodedURIComponent(
		JSON.stringify(data),
	);

	const clientUrl =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:5173'
			: 'https://git-viz.netlify.app';

	const url = `${clientUrl}/?q=${compressed}`;
	await open(url);

	return data;
};

// Execute and log result
getGitStats();
