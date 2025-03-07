import { useState } from 'react';

const options = [
	{
		package: 'npm',
		command: 'npx @santiagozarate/gitviz init',
	},
	{
		package: 'pnpm',
		command: 'pnpx @santiagozarate/gitviz init',
	},
	{
		package: 'yarn',
		command: 'yarnx @santiagozarate/gitviz init',
	},
	{
		package: 'bun',
		command: 'bunx @santiagozarate/gitviz init',
	},
];

export function Terminal() {
	const [activePackage, setActivePackage] = useState(options[0]);

	const handleUpdatePackage = (name: string) => {
		setActivePackage(options.find((o) => o.package === name)!);
	};

	return (
		<section className='rounded-md border bg-background'>
			<header className='flex border-b *:border-r *:p-2'>
				{options.map((option) => (
					<button
						data-active={activePackage.package === option.package ? '' : null}
						className='cursor-pointer transition-colors hover:bg-border data-active:bg-border'
						onClick={() => handleUpdatePackage(option.package)}
						key={option.package}
					>
						{option.package}
					</button>
				))}
			</header>
			<section className='flex gap-2 p-4'>
				<span className='text-green-600'>&gt;_</span>
				<p>{activePackage.command}</p>
			</section>
		</section>
	);
}
