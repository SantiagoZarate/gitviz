import { motion, type Variants } from 'motion/react';
import type { ForwardedRef } from 'react';

interface Props {
	gap: number;
	amount: number;
	ref: ForwardedRef<SVGCircleElement>;
	initialY: number;
	cx: number;
	branchingDot: number;
	delayAnimation?: number;
	color: keyof typeof colorVariant;
}

const item: Variants = {
	hidden: { r: 0 },
	show: {
		r: 6,
		transition: {
			type: 'spring',
		},
	},
};

const colorVariant = {
	green: {
		path: 'stroke-green-500/50',
		circle: 'fill-green-500',
	},
	red: {
		path: 'stroke-red-500/50',
		circle: 'fill-red-500',
	},
	blue: {
		path: 'stroke-blue-500/50',
		circle: 'fill-blue-500',
	},
};

export function DotsLine({
	amount,
	gap,
	ref,
	initialY,
	cx,
	branchingDot,
	delayAnimation = 0,
	color,
}: Props) {
	const container: Variants = {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const aux = (amount - 1) * gap;

	// @ts-ignore
	container.show.transition.delayChildren = delayAnimation;
	return (
		<>
			<motion.path
				d={`M${cx} ${initialY + aux}, ${cx} ${initialY}`}
				initial={{ pathLength: 0, opacity: 0 }}
				animate={{
					opacity: 1,
					pathLength: 1,
					transition: { type: 'spring', duration: 3, delay: delayAnimation },
				}}
				className={colorVariant[color].path}
				stroke='green'
				strokeWidth='4'
				strokeLinecap='round'
				fill='transparent'
			/>
			<motion.g variants={container} initial='hidden' animate='show'>
				{[...Array(amount).keys()].reverse().map((index) => {
					const cy = index * gap;

					return (
						<motion.circle
							key={index}
							variants={item}
							ref={index === branchingDot - 1 ? ref : null}
							className={`${colorVariant[color].circle} hover:fill-gray-400`}
							whileHover={{
								r: 12,
								transition: {
									type: 'spring',
								},
							}}
							cx={cx}
							cy={cy + initialY}
							stroke='#777'
							strokeWidth='2'
						/>
					);
				})}
			</motion.g>
		</>
	);
}

/* <rect
								x={cx + 8} // Adjust to fit text
								y={cy + initialY - 12}
								width='50' // Adjust based on text length
								height='20'
								rx='6' // Border-radius
								ry='6' // Border-radius
								fill='white' // Background color
								stroke='black'
								strokeWidth='1'
								className='opacity-0 transition group-hover:opacity-100'
							/>
							<text
								className='opacity-0 transition group-hover:opacity-100'
								x={cx + 10}
								y={cy + initialY}
								fill='black'
								fontSize='12'
								fontWeight='bold'
								textAnchor='start'
								dominantBaseline='middle'
							>
								feat: hola
							</text> */
