import { type HTMLMotionProps, type Variants, motion } from 'motion/react';

type Props = HTMLMotionProps<'div'>;

const itemVariants: Variants = {
	visible: {
		opacity: 1,
		x: 0,
		filter: 'blur(0px)',
	},
	hidden: {
		opacity: 0,
		x: 100,
		filter: 'blur(10px)',
	},
};

export function MotionItem({ ...props }: Props) {
	return <motion.div variants={itemVariants} layout {...props} />;
}
