import { generateChartConfig } from './components/charts/generate-chart-config';
import { PieChart } from './components/charts/pie-chart';
import { Header } from './components/common/header';
import { ActiveContributor } from './components/contributors/active-contributor';
import { ContributorsList } from './components/contributors/contributors-list';
import { useGitContext } from './context/global-context';
import { cleanEmail } from './helpers/clean-email';

export default function App() {
	const { contributors } = useGitContext();

	const dataForChart =
		contributors.map(({ commits, email }) => ({
			dataKey: commits,
			nameKey: email,
			fill: `var(--color-${cleanEmail(email)})`,
		})) ?? [];

	const chartConfig = generateChartConfig({
		data: contributors.map((c) => ({ email: c.email, name: c.name[0] })) ?? [],
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
