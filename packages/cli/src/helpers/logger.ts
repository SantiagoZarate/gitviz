const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	red: '\x1b[31m',
};

export const log = {
	info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
	success: (msg: string) =>
		console.log(`${colors.green}✓${colors.reset} ${msg}`),
	warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
	error: (msg: string) => console.error(`${colors.red}✕${colors.reset} ${msg}`),
};
