export function Limitations() {
	return (
		<section className='mx-auto flex max-w-tablet flex-col gap-8 p-6'>
			<h3>Limitations</h3>
			<section className='flex flex-col gap-4'>
				<p className='font-semibold'>Commits number</p>
				<p className='text-primary/60 text-sm'>
					This tool runs entirely serverless, with the CLI sending data directly
					to the browser via the URL. Due to URL size limits, only the last{' '}
					<strong className='text-primary'>3000 commits</strong> are analyzed,
					ensuring fast and efficient processing.
				</p>
			</section>
			<section className='flex flex-col gap-4'>
				<p className='font-semibold'>Local branches</p>
				<p className='text-primary/60 text-sm'>
					Only local branches are included—fetch remote branches first if
					needed.
				</p>
			</section>
		</section>
	);
}
