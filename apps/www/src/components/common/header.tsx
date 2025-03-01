import { useGitContext } from '@/context/global-context';

export function Header() {
	const { title, branch } = useGitContext();

	return (
		<header className='flex flex-col gap-2'>
			<section className='flex items-center gap-2'>
				<h1>{title}</h1>
				<p className='text-sm'>{branch}</p>
			</section>
			<p>Visualize git contributors on a repo</p>
		</header>
	);
}
