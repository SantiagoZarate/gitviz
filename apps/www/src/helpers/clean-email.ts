export function cleanEmail(email: string): string {
	return email.split('@')[0].replace('.', '').replace('+', '');
}
