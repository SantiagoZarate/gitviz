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
		<section className='mx-auto grid w-full max-w-tablet grid-rows-[auto_1fr] gap-12 px-6 pt-12 pb-20'>
			<RepoHeader />
			<section className='grid h-full grid-cols-2 gap-6'>
				<section className='relative'>
					<section className='sticky top-12 flex flex-col gap-2'>
						<PieChart data={dataForChart} config={chartConfig} />
						<ActiveContributor />
					</section>
				</section>
				<Contributors />
			</section>
		</section>
	);
}
