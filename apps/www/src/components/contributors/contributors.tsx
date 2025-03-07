import { useGitContext } from '@/context/global-context';
import { useState } from 'react';
import { ContributorsIcon } from '../icons/contributors-icon';
import { Input } from '../ui/input';
import { ContributorsList } from './contributors-list';

export function Contributors() {
	const { contributors } = useGitContext();
	const [textFilter, setTextFilter] = useState<string>('');

	const filteredContributors = contributors.filter((c) =>
		c.name.some((n) =>
			n.toLocaleLowerCase().includes(textFilter.toLocaleLowerCase()),
		),
	);

	const handleUpdateText = (newValue: string) => {
		if (newValue.startsWith(' ')) return;
		setTextFilter(newValue);
	};

	return (
		<section className='flex flex-col gap-4 overflow-hidden p-4'>
			<header className='flex items-center gap-2'>
				<span className='w-fit rounded-md border p-1'>
					<ContributorsIcon />
				</span>
				<h3>
					{contributors.length}{' '}
					{contributors.length > 1 ? 'Contributors' : 'Contributor'}
				</h3>
			</header>
			<section className='flex flex-col gap-2'>
				<label htmlFor='contributor'>Filter by contributor name</label>
				<Input
					onChange={(e) => handleUpdateText(e.target.value)}
					placeholder='John Doe'
				/>
			</section>
			<ContributorsList contributors={filteredContributors} />
		</section>
	);
}
