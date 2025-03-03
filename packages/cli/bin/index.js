#!/usr/bin/env node

import LZString from 'lz-string';
import open from 'open';
import simpleGit from 'simple-git';

// Helpers functions
import args from '../helpers/args';
import { getAllBranches } from '../helpers/git/get-all-branches';
import { getContributors } from '../helpers/git/get-contributors';
import { getCurrentBranch } from '../helpers/git/get-current-branch';
import { getLineOwnership } from '../helpers/git/get-line-ownership';
import { getRepoName } from '../helpers/git/get-repo-name';
import { jsonToCsv } from '../helpers/json-to-csv';

export const git = simpleGit();

// Main function to gather Git stats for all branches
export const getGitStats = async () => {
	const repoName = await getRepoName();
	const branches = args.currentBranchOnly
		? await getCurrentBranch()
		: await getAllBranches();

	const currentBranch = (await git.branchLocal(['--format="%(refname:short)"']))
		.current;

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

	const compressed = LZString.compressToEncodedURIComponent(
		JSON.stringify(data),
	);

	const csv = jsonToCsv(data);

	const csvCompressed = LZString.compressToEncodedURIComponent(csv);

	console.log('JSON COMPRESSED LENGTH: ', JSON.stringify(data).length);
	console.log('CSV COMPRESSED LENGTH: ', csvCompressed.length);

	const clientUrl =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:5173'
			: 'https://git-viz.netlify.app';

	const url = `${clientUrl}/stats/?q=${compressed}`;
	await open(url);

	return data;
};

// Execute and log result
getGitStats();
