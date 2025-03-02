import { type Branch, type Contributor, gitSchema } from '@/lib/git-schema';
import LZString from 'lz-string';
import { parseAsString, useQueryState } from 'nuqs';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useState,
} from 'react';

interface State {
	activeContributor: Contributor | null;
	contributors: Contributor[];
	activeBranch: Branch;
	title: string;
}

interface Actions {
	updateActiveContributor: (name: string) => void;
}

type GitContextProps = State & Actions;

const gitContext = createContext<GitContextProps | null>(null);

export function GitContextProvider({ children }: PropsWithChildren) {
	const [compressedData] = useQueryState('q', parseAsString);

	const decompressed = LZString.decompressFromEncodedURIComponent(
		compressedData!,
	);

	const parsedData = gitSchema.parse(JSON.parse(decompressed));
	const [json] = useState({
		...parsedData,
		branchs: parsedData.branchs.map((branch) => ({
			...branch,
			contributors: branch.contributors,
		})),
	});

	const [activeBranch, setActiveBranch] = useState<Branch>(json.branchs[0]);

	const [activeContributor, setActiveContributor] =
		useState<Contributor | null>(null);

	if (!json) {
		return;
	}

	const handleUpdateActiveContributor = (email: string) => {
		setActiveContributor((prevState) => {
			if (prevState?.email === email) {
				return null;
			}

			return activeBranch.contributors.find((c) => c.email === email)!;
		});
	};

	return (
		<gitContext.Provider
			value={{
				// States
				contributors: activeBranch.contributors,
				activeContributor,
				title: json.repoName,
				activeBranch,
				// Actions
				updateActiveContributor: handleUpdateActiveContributor,
			}}
		>
			{children}
		</gitContext.Provider>
	);
}

export function useGitContext() {
	const value = useContext(gitContext);

	if (!value) {
		throw new Error('Context not initialized');
	}

	return value;
}
