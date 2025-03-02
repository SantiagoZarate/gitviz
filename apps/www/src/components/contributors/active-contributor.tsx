import { useGitContext } from '@/context/global-context';
import { AnimatePresence, type Variants, motion } from 'motion/react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { ProgressBar } from '../ui/progress-bar';

const sectionVariant: Variants = {
	visible: {
		opacity: 1,
		y: 0,
	},
	hidden: {
		opacity: 0,
		y: -100,
	},
};

export function ActiveContributor() {
	const { activeContributor, contributors } = useGitContext();

	const totalContributions = contributors.reduce(
		(prev, curr) => prev + curr.commits,
		0,
	);

	const totalLoC = contributors.reduce((prev, curr) => prev + curr.owned, 0);

	const contributionLoCPercentage = (
		((activeContributor?.owned ?? 0) / totalLoC) *
		100
	).toFixed(2);

	const contributionPercentage = (
		((activeContributor?.commits ?? 0) / totalContributions) *
		100
	).toFixed(2);

	return (
		<AnimatePresence>
			{activeContributor !== null && (
				<motion.div
					variants={sectionVariant}
					animate='visible'
					exit='hidden'
					initial='hidden'
				>
					<Card>
						<CardHeader>
							<CardTitle>{activeContributor.name}</CardTitle>
							<CardDescription className='flex divide-x'>
								<p className='pr-1'>{activeContributor.commits} commits</p>
								<p className='pl-1'>{activeContributor.owned} LoC</p>
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-4'>
							<section className='flex flex-col gap-2'>
								<p className='text-sm'>
									{contributionPercentage}% commits contributed
								</p>
								<ProgressBar width={contributionPercentage} />
							</section>
							<section className='flex flex-col gap-2'>
								<p className='text-sm'>
									{contributionLoCPercentage}% loC contributed
								</p>
								<ProgressBar width={contributionLoCPercentage} />
							</section>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
