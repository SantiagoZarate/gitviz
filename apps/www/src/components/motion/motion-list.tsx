import { type HTMLMotionProps, type Variants, motion } from 'motion/react';

type Props = HTMLMotionProps<'div'>;

const listVariants: Variants = {
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
	hidden: {
		opacity: 0,
	},
};

export function MotionList({ ...props }: Props) {
	return (
		<motion.div
			variants={listVariants}
			animate='visible'
			initial='hidden'
			exit='hidden'
			{...props}
		/>
	);
}
