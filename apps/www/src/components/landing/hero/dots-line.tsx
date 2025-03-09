import type { ForwardedRef } from 'react';

interface Props {
	gap: number;
	amount: number;
	ref: ForwardedRef<SVGCircleElement>;
	initialY: number;
	cx: number;
	branchingDot: number;
}

export function DotsLine({
	amount,
	gap,
	ref,
	initialY,
	cx,
	branchingDot,
}: Props) {
	const aux = (amount - 1) * gap;

	return (
		<>
			<path
				className='z-0'
				d={`M${cx} ${initialY}, ${cx} ${initialY + aux}`}
				stroke='green'
				strokeWidth='4'
				strokeLinecap='round'
				fill='transparent'
			/>
			{Array(amount)
				.fill(1)
				.map((_n, index) => {
					const cy = index * gap;

					return (
						<circle
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							ref={index === branchingDot - 1 ? ref : null}
							className='z-50 fill-red-700'
							cx={cx}
							cy={cy + initialY}
							stroke='#777'
							strokeWidth='2'
							r='6'
						/>
					);
				})}
		</>
	);
}
