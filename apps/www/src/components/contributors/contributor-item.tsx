import type { Contributor } from '@/lib/git-schema';

interface Props {
	contributor: Contributor;
	onSelect: () => void;
	active?: boolean;
}

export function ContributorItem({
	contributor,
	onSelect,
	active = false,
}: Props) {
	return (
		<li
			data-active={active ? '' : undefined}
			className='hover:-translate-y-1 group flex cursor-pointer items-center justify-between gap-12 rounded-xl border p-2 transition hover:bg-secondary data-active:bg-green-500/20'
			onClick={onSelect}
		>
			<section className='flex flex-col gap-1'>
				<section className='flex flex-col gap-1'>
					<section className='flex gap-2'>
						{contributor.name.map((name) => (
							<p key={name} className='group-data-active:font-semibold'>
								{name}
							</p>
						))}
					</section>
					<p className='text-xs'>{contributor.email}</p>
				</section>
				<section className='flex gap-2'>
					<span className='rounded-full bg-green-200 px-2 py-1 text-green-600 text-xs'>
						{contributor.linesOfCode}
					</span>
					<span className='rounded-full bg-red-200 px-2 py-1 text-red-600 text-xs'>
						{contributor.removed}
					</span>
				</section>
			</section>
			<section className=''>
				<p>{contributor.commits}</p>
			</section>
		</li>
	);
}
