import { HeroSection } from '@/components/landing/hero/hero-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<section className='flex flex-col divide-y'>
			<div className=''>
				<HeroSection />
			</div>
		</section>
	);
}
