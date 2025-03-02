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
	const [json] = useState(parsedData);

	const [activeContributor, setActiveContributor] =
		useState<Contributor | null>(null);

	if (!json) {
		return;
	}

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
				contributors: json?.contributors.sort((a, b) => b.commits - a.commits),
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
