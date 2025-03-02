import { useGitContext } from '@/context/global-context';

export function Header() {
	const { title, branch, contributors } = useGitContext();

	const totalLoC = contributors.reduce((prev, curr) => prev + curr.owned, 0);

	return (
		<header className='flex flex-col gap-2'>
			<section className='flex items-center gap-2'>
				<h1>{title}</h1>
				<p className='text-sm'>{branch}</p>
			</section>
			<p>Visualize git contributors on a repo</p>
			<p>{totalLoC} Total lines of code</p>
		</header>
	);
}
