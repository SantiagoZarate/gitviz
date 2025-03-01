import { useGitContext } from '@/context/global-context';
import { AnimatePresence, type Variants, motion } from 'motion/react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

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

	const contributionPercentage = (
		((activeContributor?.commits ?? 0) / totalContributions) *
		100
	).toFixed(2);

	console.log({ contributionPercentage });

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
							<CardDescription>
								{activeContributor.commits} commits
							</CardDescription>
						</CardHeader>
						<CardContent>
							<section className='flex flex-col gap-2'>
								<p className='text-sm'>{contributionPercentage}% contributed</p>
								<section className='relative'>
									<div className='h-2 w-full rounded-xl bg-green-300' />
									<motion.div
										animate={{ width: `${contributionPercentage}%` }}
										className='absolute top-0 h-full rounded-xl bg-green-700'
									/>
								</section>
							</section>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
