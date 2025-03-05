export interface Commit {
	// Commits per hour
	cph: {
		[key: string]: number;
	};
	// Commits per month
	cpm: {
		[key: string]: number;
	};
	l: string;
	f: string;
}
