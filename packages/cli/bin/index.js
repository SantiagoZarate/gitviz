#!/usr/bin/env node

import LZString from 'lz-string';
import childProcess from 'node:child_process';
import path from 'node:path';
import open from 'open';
import simpleGit from 'simple-git';

const git = simpleGit();
const args = process.argv.slice(2);
const FETCH_REMOTE = args.includes('--fetch-remote') || args.includes('-r');

const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	red: '\x1b[31m',
};

const log = {
	info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
	success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
	warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
	error: (msg) => console.error(`${colors.red}✕${colors.reset} ${msg}`),
};

const getRepoRoot = () => {
	try {
		return childProcess
			.execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' })
			.trim();
	} catch (err) {
		log.error('Not a Git repository. Please run this inside a Git project.');
		process.exit(1);
	}
};

const getRepoName = () => path.basename(getRepoRoot());

const stashChanges = async () => {
	try {
		const status = await git.status();
		if (status.files.length > 0) {
			log.info('Stashing uncommitted changes...');
			await git.stash([
				'push',
				'-u',
				'-m',
				'Temporary stash before branch switch',
			]);
			return true; // Indicate that a stash was created
		}
	} catch (error) {
		log.error('Failed to stash changes.');
		process.exit(1);
	}
	return false;
};

const popStash = async () => {
	try {
		const stashList = await git.stashList();
		if (stashList.total > 0) {
			log.info('Restoring stashed changes...');
			await git.stash(['pop']);
		}
	} catch (error) {
		log.error('Failed to restore stashed changes.');
	}
};

const fetchRemoteBranches = async () => {
	log.info('Fetching remote branches...');
	await git.fetch();
	const remoteBranches = childProcess
		.execSync('git branch -r', { encoding: 'utf-8' })
		.split('\n')
		.map((branch) => branch.trim())
		.filter((branch) => branch && !branch.includes('->'));

	for (const remoteBranch of remoteBranches) {
		const localBranch = remoteBranch.replace(/^origin\//, '');
		const isTracked = childProcess
			.execSync('git branch', { encoding: 'utf-8' })
			.includes(localBranch);

		if (!isTracked) {
			log.info(`Tracking remote branch: ${remoteBranch} as ${localBranch}`);
			await git.checkout(['-b', localBranch, '--track', remoteBranch]);
		}
	}

	log.success('Remote branches fetched and tracked.');
};

const getAllBranches = async () => {
	const branches = await git.branchLocal(['--format="%(refname:short)"']);
	return branches.all.map((branch) => branch.replace(/"/g, ''));
};

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

export const getGitStats = async () => {
	log.info('Starting Git analysis...');
	const repoName = await getRepoName();
	log.success(`Repository detected: ${repoName}`);

	let stashCreated = false;

	try {
		if (FETCH_REMOTE) {
			stashCreated = await stashChanges();
			await fetchRemoteBranches();
		}

		const branches = await getAllBranches();
		const currentBranch = (
			await git.branchLocal(['--format="%(refname:short)"'])
		).current;

		log.info(`Current branch: ${currentBranch}`);
		log.info(`Processing ${branches.length} branches...`);

		const branchData = [];

		for (const branch of branches) {
			await git.checkout(branch);

			const contributors = await getContributors();
			await getLineOwnership(contributors);

			branchData.push({
				n: branch,
				co: Array.from(contributors.values()),
			});
		}

		// Restore to the original branch
		await git.checkout(currentBranch);

		const data = {
			t: repoName,
			b: branchData,
		};

		log.success('Git analysis completed successfully.');

		// Compress and open in browser
		log.info('Opening visualization in browser...');
		const compressed = LZString.compressToEncodedURIComponent(
			JSON.stringify(data),
		);

		const clientUrl =
			process.env.NODE_ENV === 'development'
				? 'http://localhost:5173'
				: 'https://git-viz.netlify.app';

		const url = `${clientUrl}/stats/?q=${compressed}`;
		await open(url);

		log.success('Done!');

		if (stashCreated) await popStash();

		return data;
	} catch (error) {
		log.error(`Error: ${error.message}`);
		if (stashCreated) await popStash(); // Restore stash if something goes wrong
		process.exit(1);
	}
};

getGitStats().catch(console.log);
