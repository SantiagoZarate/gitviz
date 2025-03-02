import { useGitContext } from '@/context/global-context';
import { BranchIcon } from '../icons/branch-icon';

export function Header() {
	const { title, branch, contributors } = useGitContext();

	const totalLoC = contributors.reduce((prev, curr) => prev + curr.owned, 0);

	return (
		<header className='flex flex-col gap-2'>
			<section className='flex items-center gap-2'>
				<h1>{title}</h1>
				<div className='flex items-center gap-1 rounded-full border px-2 py-1'>
					<BranchIcon />
					<p className='text-sm'>{branch}</p>
				</div>
			</section>
			<p>Visualize git contributors on a repo</p>
			<p>{totalLoC} Total lines of code</p>
		</header>
	);
}
