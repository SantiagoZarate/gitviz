import { useGitContext } from '@/context/global-context';
import type { ContributorMultiNames } from '@/helpers/merge-contributor';
import { AnimatePresence } from 'motion/react';
import { MotionItem } from '../motion/motion-item';
import { MotionList } from '../motion/motion-list';
import { ContributorItem } from './contributor-item';
import { EmptyContributors } from './empty-contributors';

interface Props {
	contributors: ContributorMultiNames[];
}

export function ContributorsList({ contributors }: Props) {
	const { activeContributor, updateActiveContributor } = useGitContext();

	if (!contributors.length) {
		return <EmptyContributors />;
	}

	return (
		<MotionList className='flex flex-col gap-2'>
			<AnimatePresence mode='popLayout'>
				{contributors.map((contributor) => (
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
	);
}
