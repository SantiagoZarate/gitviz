import { execSync } from 'node:child_process';

// Get repository root directory
export const getRepoRoot = () => {
	return execSync('git rev-parse --show-toplevel', {
		encoding: 'utf-8',
	}).trim();
};
