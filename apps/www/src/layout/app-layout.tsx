import { Footer } from '@/components/common/footer/footer';
import { Header } from '@/components/common/header';
import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
	return (
		<section>
			<Header />
			<section className='relative grid min-h-dvh grid-rows-[1fr_auto] pt-[59px]'>
				{children}
				<Footer />
			</section>
		</section>
	);
}
