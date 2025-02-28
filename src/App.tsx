import { generateChartConfig } from './components/charts/generate-chart-config';
import { PieChart } from './components/charts/pie-chart';
import { ContributorsList } from './components/contributors/contributors-list';
import { useGitContext } from './context/global-context';

export default function App() {
	const { contributors, title } = useGitContext();

	const dataForChart =
		contributors.map((contributor) => ({
			dataKey: contributor.c,
			nameKey: contributor.n,
			fill: `var(--color-${contributor.n})`,
		})) ?? [];

	const chartConfig = generateChartConfig({
		data: contributors.map((c) => c.n) ?? [''],
	});

	return (
		<section className='mx-auto flex min-h-dvh w-full max-w-tablet flex-col gap-12 px-6 py-20'>
			<header className='flex flex-col gap-2'>
				<h1>{title}</h1>
				<p>Visualize git contributors on a repo</p>
			</header>
			<section className='grid h-full grid-cols-2 gap-6'>
				<PieChart data={dataForChart} config={chartConfig} />
				<ContributorsList />
			</section>
		</section>
	);
}
