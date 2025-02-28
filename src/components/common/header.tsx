import { useGitContext } from '@/context/global-context';

export function Header() {
	const { title } = useGitContext();

	return (
		<header className='flex flex-col gap-2'>
			<h1>{title}</h1>
			<p>Visualize git contributors on a repo</p>
		</header>
	);
}
