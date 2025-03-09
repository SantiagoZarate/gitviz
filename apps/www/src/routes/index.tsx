import { HeroSection } from '@/components/landing/hero/hero-section';
import { Limitations } from '@/components/landing/limitations/limitations';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<section className='flex flex-col'>
			<div className='border-b'>
				<HeroSection />
			</div>
			<Limitations />
		</section>
	);
}
