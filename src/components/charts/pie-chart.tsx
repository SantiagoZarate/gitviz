import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart as RechartPieChart } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface Props {
	data: {
		dataKey: number;
		nameKey: string;
		fill: string;
	}[];
	config: ChartConfig;
}

export function PieChart({ data, config }: Props) {
	const totalVisitors = React.useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.dataKey, 0);
	}, [data]);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Pie Chart - Donut with Text</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={config}
					className='mx-auto aspect-square max-h-[250px]'
				>
					<RechartPieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={data}
							dataKey='dataKey'
							nameKey='nameKey'
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground font-bold text-3xl'
												>
													{totalVisitors.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Commits
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</RechartPieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<div className='flex items-center gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='text-muted-foreground leading-none'>
					Showing total visitors for the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}
