import { basename } from 'node:path';
import { getRepoRoot } from './get-repo-root';

// Get repository name from the root folder
export const getRepoName = () => basename(getRepoRoot());
