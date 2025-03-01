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
		(prev, curr) => prev + curr.c,
		0,
	);

	const contributionPercentage = (
		((activeContributor?.c ?? 0) / totalContributions) *
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
							<CardTitle>{activeContributor.n}</CardTitle>
							<CardDescription>{activeContributor.c} commits</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{contributionPercentage}% contributed</p>
							<section className='relative'>
								<div className='h-2 w-full rounded-xl bg-green-300' />
								<div
									style={{ width: `${contributionPercentage}%` }}
									className='absolute top-0 h-full rounded-xl bg-green-700'
								/>
							</section>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
