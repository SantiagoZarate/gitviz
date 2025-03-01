import { motion } from 'motion/react';

interface Props {
	width: string;
}

export function ProgressBar({ width }: Props) {
	return (
		<section className='relative'>
			<div className='h-2 w-full rounded-xl bg-green-300' />
			<motion.div
				animate={{ width: `${width}%` }}
				className='absolute top-0 h-full rounded-xl bg-green-700'
			/>
		</section>
	);
}
