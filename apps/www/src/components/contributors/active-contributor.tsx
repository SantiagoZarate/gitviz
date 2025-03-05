import { useGitContext } from '@/context/global-context';
import { mapCommitMonths } from '@/helpers/map-commits-months';
import { formatCommitDate } from '@/lib/format-commit-date';
import { AnimatePresence, type Variants, motion } from 'motion/react';
import { BarChart } from '../charts/bar-chart';
import { generateChartConfig } from '../charts/generate-chart-config';
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
		(prev, curr) => prev + curr.commits.amount,
		0,
	);

	const totalLoC = contributors.reduce((prev, curr) => prev + curr.owned, 0);

	const contributionLoCPercentage = (
		((activeContributor?.owned ?? 0) / totalLoC) *
		100
	).toFixed(2);

	const contributionPercentage = (
		((activeContributor?.commits.amount ?? 0) / totalContributions) *
		100
	).toFixed(2);

	const defaultPfp =
		'https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?width=1080&crop=smart&auto=webp&s=67e1e2ad39382a1d2822a854781e441f33656554';

	const contributionsByMonth = mapCommitMonths(
		activeContributor?.commits.commitsPerMonth ?? {},
	);

	console.log({ contributionsByMonth });

	const chartData = Object.entries(contributionsByMonth).map(
		([nameKey, dataKey]) => {
			return {
				dataKey,
				nameKey,
			};
		},
	);

	const chartConfig = generateChartConfig({
		data: chartData.map((c) => ({ email: c.nameKey, name: c.nameKey })),
	});

	const commitsPerHour = activeContributor?.commits.commitsPerHour;

	const hoursData = Object.entries(commitsPerHour ?? {}).map(
		([nameKey, dataKey]) => {
			return {
				dataKey,
				nameKey,
			};
		},
	);

	return (
		<AnimatePresence>
			{activeContributor !== null && (
				<section className='flex flex-col gap-2'>
					<motion.div
						variants={sectionVariant}
						animate='visible'
						exit='hidden'
						initial='hidden'
					>
						<Card>
							<CardHeader className='flex-row items-center gap-2'>
								<img
									className='size-10 rounded-md'
									src={activeContributor.avatar ?? defaultPfp}
									alt='avatar profile'
								/>
								<section className='flex flex-col gap-2'>
									<CardTitle>{activeContributor.name}</CardTitle>
									<CardDescription className='flex divide-x'>
										<p className='pr-1'>
											{activeContributor.commits.amount} commits
										</p>
										<p className='pl-1'>{activeContributor.owned} LoC</p>
									</CardDescription>
								</section>
							</CardHeader>
							<CardContent className='flex flex-col gap-4'>
								<section>
									<p>{activeContributor.linesOfCode} lines of code added</p>
									<p>{activeContributor.removed} lines of code removed</p>
								</section>
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
								<section className='flex flex-col gap-2'>
									<section>
										<p className='text-primary/50 text-sm'>
											Latest contribution
										</p>
										<p>{formatCommitDate(activeContributor.commits.last)}</p>
									</section>
									<section>
										<p className='text-primary/50 text-sm'>
											First contribution
										</p>
										<p>{formatCommitDate(activeContributor.commits.first)}</p>
									</section>
								</section>
							</CardContent>
						</Card>
					</motion.div>
					<BarChart data={chartData} config={chartConfig} />
					<BarChart data={hoursData} config={chartConfig} />
				</section>
			)}
		</AnimatePresence>
	);
}
