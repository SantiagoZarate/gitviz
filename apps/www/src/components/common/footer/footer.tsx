export function Footer() {
	return (
		<>
			<footer className='relative z-50 w-full gap-12 border-t bg-gradient-to-t from-transparent via-transparent to-secondary/40 pt-12 pb-20 backdrop-blur-sm'>
				<section className='mx-auto flex max-w-tablet justify-between px-6'>
					<section>2025</section>
					<section>
						<p>Santiago Zarate</p>
					</section>
				</section>
			</footer>
			<section className='absolute bottom-0 grid w-full grid-cols-[auto_minmax(400px,805px)_auto]'>
				<p className='-translate-y-28 pointer-events-none col-start-2 text-8xl text-border'>
					Gitviz
				</p>
			</section>
		</>
	);
}
