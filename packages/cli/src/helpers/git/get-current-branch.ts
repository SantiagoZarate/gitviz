import { git } from '../..';

// Get all branches
export async function getCurrentBranch() {
	// @ts-ignore
	const currentBranch = (await git.branchLocal(['--format="%(refname:short)"']))
		.current;
	return [currentBranch];
}
