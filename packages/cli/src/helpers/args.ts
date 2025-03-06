const [, , ...args] = process.argv;

const currentBranchOnly = args.includes('--current') || args.includes('-c');
const getOwnership = args.includes('--owner') || args.includes('-o');

export default {
	currentBranchOnly,
	getOwnership,
};
