import type { ChartConfig } from '../ui/chart';

interface Props {
	data: string[];
}

export function generateChartConfig({ data }: Props): ChartConfig {
	const aux: ChartConfig = {};

	data.forEach((d, index) => {
		aux[d] = {
			label: d,
			color: `var(--chart-${index + 1})`,
		};
	});

	return aux;
}
