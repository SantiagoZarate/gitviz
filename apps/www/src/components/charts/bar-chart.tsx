'use client';

import { TrendingUp } from 'lucide-react';
import {
	Bar,
	CartesianGrid,
	LabelList,
	BarChart as ReachartBarChart,
	XAxis,
} from 'recharts';

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
	}[];
	config: ChartConfig;
}

export function BarChart({ data, config }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Bar Chart - Label</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<ReachartBarChart
						accessibilityLayer
						data={data}
						margin={{
							top: 20,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='nameKey'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey='dataKey' fill='var(--chart-1)' radius={8}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={12}
							/>
						</Bar>
					</ReachartBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='flex gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='text-muted-foreground leading-none'>
					Showing total visitors for the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}
