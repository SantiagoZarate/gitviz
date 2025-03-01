import type { Contributor } from '@/lib/git-schema';

interface Props {
	contributor: Contributor;
	onDelete: () => void;
	onSelect: () => void;
	active?: boolean;
}

export function ContributorItem({
	contributor,
	onDelete,
	onSelect,
	active = false,
}: Props) {
	return (
		<li
			data-active={active ? '' : undefined}
			className='hover:-translate-y-1 group flex cursor-pointer items-center justify-between gap-12 rounded-xl border p-2 transition hover:bg-secondary data-active:bg-green-50'
			onClick={onSelect}
		>
			<section className='flex flex-col gap-1'>
				<section className='flex flex-col gap-1'>
					<p className='group-data-active:font-semibold'>{contributor.n}</p>
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
					onClick={onDelete}
					type='button'
				>
					x
				</button>
			</section>
		</li>
	);
}
