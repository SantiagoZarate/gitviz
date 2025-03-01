import { type Contributor, gitSchema } from '@/lib/git-schema';
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
	title: string;
	branch: string;
}

interface Actions {
	deleteContributor: (name: string) => void;
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
	const [json, setJson] = useState(parsedData);

	const [activeContributor, setActiveContributor] =
		useState<Contributor | null>(null);

	if (!json) {
		return;
	}

	const handleRemoveContributor = (name: string) => {
		setJson((prevState) => {
			const filteredContributors = prevState?.contributors.filter(
				(co) => co.name !== name,
			);

			return {
				...prevState,
				contributors: filteredContributors ?? [],
			};
		});
	};

	const handleUpdateActiveContributor = (name: string) => {
		setActiveContributor((prevState) => {
			if (prevState?.name === name) {
				return null;
			}

			return json.contributors.find((c) => c.name === name)!;
		});
	};

	return (
		<gitContext.Provider
			value={{
				// States
				contributors: json?.contributors,
				activeContributor,
				title: json.repoName,
				branch: json.branch,
				// Actions
				updateActiveContributor: handleUpdateActiveContributor,
				deleteContributor: handleRemoveContributor,
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
