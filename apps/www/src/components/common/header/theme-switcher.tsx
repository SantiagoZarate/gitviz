import { useTheme } from '@/hooks/use-theme';
import { MoonIcon, SunIcon } from 'lucide-react';

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className='z-50 cursor-pointer rounded-md border p-2'
			onClick={() => toggleTheme()}
		>
			<div>{theme === 'dark' ? <MoonIcon /> : <SunIcon />}</div>
		</button>
	);
}
