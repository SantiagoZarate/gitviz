import { useGitContext } from '@/context/global-context';
import { useState } from 'react';
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
		<section className='flex flex-col gap-4'>
			<header className='flex flex-col gap-2'>
				<h3>Contributors</h3>
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
