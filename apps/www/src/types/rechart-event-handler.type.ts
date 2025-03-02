export interface RechartEventHandler {
	percent: number;
	name: string;
	tooltipPayload: TooltipPayload[];
	midAngle: number;
	middleRadius: number;
	tooltipPosition: TooltipPosition;
	payload: WelcomePayload;
	stroke: string;
	fill: string;
	cx: number;
	cy: number;
	className: string;
	strokeWidth: number;
	dataKey: number;
	nameKey: string;
	innerRadius: number;
	outerRadius: number;
	maxRadius: number;
	value: number;
	startAngle: number;
	endAngle: number;
	paddingAngle: number;
}

export interface WelcomePayload {
	payload: PayloadPayload;
	stroke: string;
	fill: string;
	cx: string;
	cy: string;
	className: string;
	strokeWidth: number;
	dataKey: number;
	nameKey: string;
}

export interface PayloadPayload {
	dataKey: number;
	nameKey: string;
	fill: string;
}

export interface TooltipPayload {
	name: string;
	value: number;
	payload: WelcomePayload;
	dataKey: string;
}

export interface TooltipPosition {
	x: number;
	y: number;
}
