import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark';

export function useTheme() {
	const [theme, setTheme] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(THEME_KEY) || 'light';
		}
		return 'light';
	});

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add(DARK_CLASS);
		} else {
			document.documentElement.classList.remove(DARK_CLASS);
		}
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return { theme, toggleTheme };
}
