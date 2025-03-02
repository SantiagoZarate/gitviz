import {
	type ContributorMultiNames,
	mergeContributor,
} from '@/helpers/merge-contributor';
import { gitSchema } from '@/lib/git-schema';
import LZString from 'lz-string';
import { parseAsString, useQueryState } from 'nuqs';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useState,
} from 'react';

interface State {
	activeContributor: ContributorMultiNames | null;
	contributors: ContributorMultiNames[];
	title: string;
	branch: string;
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
		contributors: mergeContributor(parsedData.contributors).sort(
			(a, b) => b.commits - a.commits,
		),
	});

	const [activeContributor, setActiveContributor] =
		useState<ContributorMultiNames | null>(null);

	if (!json) {
		return;
	}

	const handleUpdateActiveContributor = (email: string) => {
		setActiveContributor((prevState) => {
			if (prevState?.email === email) {
				return null;
			}

			return json.contributors.find((c) => c.email === email)!;
		});
	};

	return (
		<gitContext.Provider
			value={{
				// States
				contributors: json.contributors,
				activeContributor,
				title: json.repoName,
				branch: json.branch,
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
