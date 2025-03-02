import { ThemeSwitcher } from './header/theme-switcher';

export function Header() {
	return (
		<header className='fixed top-0 left-0 w-full border-b px-6 py-2'>
			<div className='mx-auto flex max-w-tablet items-center justify-between'>
				<a href='/'>Gitviz</a>
				<section>
					<ThemeSwitcher />
				</section>
			</div>
		</header>
	);
}
