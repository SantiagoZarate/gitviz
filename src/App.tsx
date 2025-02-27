import { gitSchema } from '@/lib/git-schema';
import { parseAsJson, useQueryState } from 'nuqs';
import { generateChartConfig } from './components/charts/generate-chart-config';
import { PieChart } from './components/charts/pie-chart';
import { ContributorsList } from './components/contributors/contributors-list';

export default function App() {
	const [json, setJson] = useQueryState('json', parseAsJson(gitSchema.parse));

	if (!json) {
		return;
	}

	const dataForChart =
		json?.co.map((contributor, index) => ({
			dataKey: contributor.c,
			nameKey: contributor.n,
			fill: `var(--color-${contributor.n})`,
		})) ?? [];

	const chartConfig = generateChartConfig({
		data: json.co.map((c) => c.n) ?? [''],
	});

	return (
		<section className='mx-auto flex min-h-dvh w-full max-w-tablet flex-col gap-12 px-6 py-20'>
			<header className='flex flex-col gap-2'>
				<h1>{json?.t}</h1>
				<p>Visualize git contributors on a repo</p>
			</header>
			<section className='grid h-full grid-cols-2 gap-6'>
				<PieChart data={dataForChart} config={chartConfig} />
				<ContributorsList contributors={json?.co ?? []} />
			</section>
		</section>
	);
}
