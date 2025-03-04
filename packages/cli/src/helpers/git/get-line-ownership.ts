import { execSync } from 'node:child_process';
import type { Contributor } from '../../types/contributor.type';
import { getRepoRoot } from './get-repo-root';

// Get total lines owned per author using git blame
export async function getLineOwnership(contributors: Map<string, Contributor>) {
	const repoRoot = getRepoRoot();
	const blameOutput = execSync(
		`git -C "${repoRoot}" ls-tree -r -z --name-only HEAD | while IFS= read -r -d '' file; do git -C "${repoRoot}" blame --line-porcelain "$file" | grep  -a '^author '; done | sort | uniq -c | sort -nr`,
		{ encoding: 'utf-8', shell: '/bin/bash' },
	);

	blameOutput.split('\n').forEach((line) => {
		const match = line.trim().match(/(\d+)\s+author (.+)/);
		if (match) {
			const [, count, name] = match;
			for (const key of contributors.keys()) {
				if (key.startsWith(`${name}|`)) {
					contributors.get(key)!.o = Number.parseInt(count);
				}
			}
		}
	});
}
