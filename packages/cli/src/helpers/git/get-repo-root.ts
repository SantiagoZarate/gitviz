import { execSync } from 'node:child_process';
import { log } from '../logger';

// Get repository root directory
export const getRepoRoot = () => {
	try {
		return execSync('git rev-parse --show-toplevel', {
			encoding: 'utf-8',
		}).trim();
	} catch (err) {
		log.error('Not a Git repository. Please run this inside a Git project.');
		process.exit(1);
	}
};
