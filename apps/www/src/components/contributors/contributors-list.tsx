import { useGitContext } from '@/context/global-context';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { MotionItem } from '../motion/motion-item';
import { MotionList } from '../motion/motion-list';
import { Input } from '../ui/input';
import { ContributorItem } from './contributor-item';

export function ContributorsList() {
	const { contributors, updateActiveContributor, activeContributor } =
		useGitContext();
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
			<MotionList className='flex flex-col gap-2'>
				<AnimatePresence mode='popLayout'>
					{filteredContributors.map((contributor) => (
						<MotionItem key={contributor.email}>
							<ContributorItem
								active={activeContributor?.email === contributor.email}
								onSelect={() => updateActiveContributor(contributor.email)}
								contributor={contributor}
							/>
						</MotionItem>
					))}
				</AnimatePresence>
			</MotionList>
		</section>
	);
}
