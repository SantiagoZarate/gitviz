import { generateChartConfig } from '@/components/charts/generate-chart-config';
import { PieChart } from '@/components/charts/pie-chart';
import { RepoHeader } from '@/components/common/repo-header';
import { ActiveContributor } from '@/components/contributors/active-contributor';
import { Contributors } from '@/components/contributors/contributors';
import { GitContextProvider, useGitContext } from '@/context/global-context';
import { cleanEmail } from '@/helpers/clean-email';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
	component: () => {
		return (
			<GitContextProvider>
				<RouteComponent />
			</GitContextProvider>
		);
	},
});

function RouteComponent() {
	const { contributors } = useGitContext();

	const dataForChart =
		contributors.map(({ commits, email }) => ({
			dataKey: commits.amount,
			nameKey: email,
			fill: `var(--color-${cleanEmail(email)})`,
		})) ?? [];

	const chartConfig = generateChartConfig({
		data: contributors.map((c) => ({ email: c.email, name: c.name[0] })) ?? [],
	});

	return (
		<section className='relative grid h-full grid-cols-[1fr_auto] divide-x'>
			<section className='flex flex-col divide-y pb-20'>
				<RepoHeader />
				<section className='flex flex-col gap-4 p-6'>
					<h1 className=''>General repo stats</h1>
					<section className='grid grid-cols-2'>
						<PieChart data={dataForChart} config={chartConfig} />
					</section>
				</section>
				<section className='flex flex-col gap-4 p-6'>
					<h1 className=''>Active contributor stats</h1>
					<ActiveContributor />
				</section>
			</section>
			<section className='sticky top-[58px] h-fit'>
				<Contributors />
			</section>
		</section>
	);
}
