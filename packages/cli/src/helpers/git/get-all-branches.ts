import { git } from '../..';

// Get all branches
export async function getAllBranches() {
	// @ts-ignore
	const branches = await git.branchLocal(['--format="%(refname:short)"']);
	return branches.all.map((branch) => branch.replace(/"/g, '')); // Remove quotes
}
