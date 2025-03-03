import { ThemeSwitcher } from './header/theme-switcher';

export function Header() {
	return (
		<header className='fixed top-0 left-0 z-50 w-full border-b border-dashed backdrop-blur-md'>
			<div className='mx-auto flex max-w-tablet items-center justify-between px-6 py-2'>
				<a href='/'>Gitviz</a>
				<section>
					<ThemeSwitcher />
				</section>
			</div>
		</header>
	);
}
