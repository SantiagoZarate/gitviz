import { motion } from 'motion/react';
import { EmptyUserIcon } from '../icons/empty-user-icon';
import { MotionItem } from '../motion/motion-item';
import { MotionList } from '../motion/motion-list';

const fadeInAnimation = {
	animate: {
		opacity: 1,
		y: 0,
	},
	initial: {
		opacity: 0,
		y: -100,
	},
};

export function EmptyContributors() {
	return (
		<section className='grid'>
			<section className='relative z-50 col-start-1 row-start-1 flex h-full items-center justify-center '>
				<div className='absolute inset-0 bg-background [mask-image:radial-gradient(at_50%_50%,black_30%,transparent)]' />
				<motion.section
					{...fadeInAnimation}
					className='z-50 flex gap-2 rounded-md border bg-background p-2'
				>
					<EmptyUserIcon />
					<p>No contributors with that name</p>
				</motion.section>
			</section>
			<MotionList className='col-start-1 row-start-1 flex flex-col gap-2'>
				{Array(5)
					.fill(1)
					.map((_n, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<MotionItem key={index}>
							<SkeletonItem />
						</MotionItem>
					))}
			</MotionList>
		</section>
	);
}

export function SkeletonItem() {
	return (
		<div className='flex animate-pulse flex-col gap-4 rounded-xl border p-2 [&_div]:h-2 [&_div]:rounded-full [&_div]:bg-secondary'>
			<div className='w-[80%]' />
			<div className='w-[20%]' />
			<section className='flex gap-2'>
				<div className='w-[10%]' />
				<div className='w-[10%]' />
			</section>
		</div>
	);
}
