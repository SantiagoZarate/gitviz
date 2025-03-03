import { git } from '../../bin';

// Get all branches
export async function getAllBranches() {
	const branches = await git.branchLocal(['--format="%(refname:short)"']);
	return branches.all.map((branch) => branch.replace(/"/g, '')); // Remove quotes
}
