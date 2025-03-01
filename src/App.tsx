import { generateChartConfig } from './components/charts/generate-chart-config';
import { PieChart } from './components/charts/pie-chart';
import { Header } from './components/common/header';
import { ActiveContributor } from './components/contributors/active-contributor';
import { ContributorsList } from './components/contributors/contributors-list';
import { useGitContext } from './context/global-context';

export default function App() {
	const { contributors } = useGitContext();

	const dataForChart =
		contributors.map((contributor) => ({
			dataKey: contributor.commits,
			nameKey: contributor.name,
			fill: `var(--color-${contributor.name})`,
		})) ?? [];

	const chartConfig = generateChartConfig({
		data: contributors.map((c) => c.name) ?? [''],
	});

	return (
		<section className='mx-auto grid min-h-dvh w-full max-w-tablet grid-rows-[auto_1fr] gap-12 px-6 py-20'>
			<Header />
			<section className='grid h-full grid-cols-2 gap-6'>
				<section className='relative'>
					<section className='sticky top-12 flex flex-col gap-2'>
						<PieChart data={dataForChart} config={chartConfig} />
						<ActiveContributor />
					</section>
				</section>
				<ContributorsList />
			</section>
		</section>
	);
}
