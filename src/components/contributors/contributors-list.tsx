import type { Contributor } from '@/lib/git-schema';

interface Props {
	contributors: Contributor[];
}

export function ContributorsList({ contributors }: Props) {
	// const handleReºmoveContributor = (name: string) => {
	//   setJson((prevState) => {
	//     const filteredContributors = prevState?.co.filter((co) => co.n !== name);
	//     return { ...prevState, co: filteredContributors };
	//   });
	// };

	return (
		<section className='flex flex-col'>
			<header>
				<h3>Contributors</h3>
			</header>
			<ul className='flex flex-col divide-y'>
				{contributors.map((contributor) => (
					<li
						key={contributor.n}
						className='flex items-center justify-between gap-12 p-2'
					>
						<section className='flex flex-col gap-1'>
							<section className='flex flex-col gap-1'>
								<p>{contributor.n}</p>
								<p className='text-xs'>{contributor.e}</p>
							</section>
							<section className='flex gap-2'>
								<span className='rounded-full bg-green-200 px-2 py-1 text-green-600 text-xs'>
									{contributor.loc}
								</span>
								<span className='rounded-full bg-red-200 px-2 py-1 text-red-600 text-xs'>
									{contributor.rm}
								</span>
							</section>
						</section>
						<section className=''>
							<p>{contributor.c}</p>
							<button
								className='rounded-full bg-red-200 p-2'
								type='button'
								// onClick={() => handleRemoveContributor(contributor.n)}
							>
								x
							</button>
						</section>
					</li>
				))}
			</ul>
		</section>
	);
}
