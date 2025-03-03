import { BranchIcon } from '@/components/icons/branch-icon';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useGitContext } from '@/context/global-context';

export function SelectBrach() {
	const { activeBranch, branchs, updateActiveBranch } = useGitContext();

	return (
		<Select defaultValue={activeBranch.name} onValueChange={updateActiveBranch}>
			<SelectTrigger className='w-[180px] cursor-pointer rounded-full'>
				<BranchIcon />
				<SelectValue placeholder='Select a fruit' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel className='text-border'>Branchs</SelectLabel>
					{branchs.map((branch) => (
						<SelectItem className='cursor-pointer' key={branch} value={branch}>
							{branch}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
