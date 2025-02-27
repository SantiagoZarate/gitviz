import { gitSchema } from '@/lib/git-schema';
import { parseAsJson, useQueryState } from 'nuqs';
import { PieChart } from './components/charts/pie-chart';
import { ContributorsList } from './components/contributors/contributors-list';

export default function App() {
	const [json, setJson] = useQueryState('json', parseAsJson(gitSchema.parse));

	console.log({ json });

	return (
		<section className='mx-auto flex min-h-dvh w-full max-w-tablet flex-col gap-12 px-6 py-20'>
			<header className='flex flex-col gap-2'>
				<h1>Gitviz</h1>
				<p>Visualize git contributors on a repo</p>
			</header>
			<section className='grid h-full grid-cols-2 gap-6'>
				<PieChart />
				<ContributorsList contributors={json?.co ?? []} />
			</section>
		</section>
	);
}
