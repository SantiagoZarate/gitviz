import { git } from '../../bin';

// Get all branches
export async function getCurrentBranch() {
	const currentBranch = (await git.branchLocal(['--format="%(refname:short)"']))
		.current;
	return [currentBranch];
}
