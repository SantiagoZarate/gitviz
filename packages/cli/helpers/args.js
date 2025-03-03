const [, , ...args] = process.argv;

const currentBranchOnly = args.includes('--current') || args.includes('-c');

export default {
	currentBranchOnly,
};
