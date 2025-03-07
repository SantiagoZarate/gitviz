import { Terminal } from '@/components/terminal/terminal';
import { GitGraphDraw } from './git-graph-draw';

export function HeroSection() {
	return (
		<section className='mx-auto grid max-w-tablet grid-cols-3 gap-12 pb-12'>
			<section className='col-span-2 flex flex-col gap-12 p-6'>
				<p className='text-4xl'>Gitviz</p>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quisquam
					obcaecati deleniti tenetur aliquid distinctio aspernatur sunt harum,
					aut labore.
				</p>
				<Terminal />
			</section>
			<GitGraphDraw />
		</section>
	);
}
