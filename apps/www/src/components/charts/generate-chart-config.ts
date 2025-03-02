import { cleanEmail } from '@/helpers/clean-email';
import type { ChartConfig } from '../ui/chart';

interface Props {
	data: {
		email: string;
		name: string;
	}[];
}

export function generateChartConfig({ data }: Props): ChartConfig {
	const aux: ChartConfig = {};

	data.forEach((d, index) => {
		const key = cleanEmail(d.email);

		aux[key] = {
			label: d.name,
			color: `var(--chart-${index + 1})`,
		};
	});

	console.log(aux);

	return aux;
}
