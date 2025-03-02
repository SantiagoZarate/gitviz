import { Header } from '@/components/common/header';
import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
	return (
		<section className='px-6'>
			<Header />
			<section className='pt-[59px]'>{children}</section>
		</section>
	);
}
