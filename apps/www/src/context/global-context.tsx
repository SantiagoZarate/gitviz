import { githubAPI } from '@/api/github/api';
import { cleanEmail } from '@/helpers/clean-email';
import { type Branch, type Contributor, gitSchema } from '@/lib/git-schema';
import LZString from 'lz-string';
import { parseAsString, useQueryState } from 'nuqs';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

interface State {
	activeContributor: Contributor | null;
	contributors: Contributor[];
	activeBranch: Branch;
	title: string;
	branchs: string[];
}

interface Actions {
	updateActiveContributor: (name: string) => void;
	updateActiveBranch: (name: string) => void;
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		githubAPI
			.getUsersInfo({ contributors: activeBranch.contributors })
			.then((response) => {
				setActiveBranch((prevState) => {
					if (!response) {
						return prevState;
					}
					const contributorsWithAvatar = prevState.contributors.map(
						(contributor) => {
							const user = response.data[cleanEmail(contributor.email)];

							const avatar = user.nodes[0].avatarUrl ?? null;

							return {
								...contributor,
								avatar,
							};
						},
					);

					return { ...prevState, contributors: contributorsWithAvatar };
				});
			})
			.catch((e) => {});
	}, [activeBranch.name]);

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

	const handleUpadteActiveBranch = (name: string) => {
		setActiveBranch(() => {
			setActiveContributor(null);
			return json.branchs.find((branch) => branch.name === name)!;
		});
	};

	return (
		<gitContext.Provider
			value={{
				// States
				branchs: json.branchs.map((b) => b.name),
				contributors: activeBranch.contributors,
				activeContributor,
				title: json.repoName,
				activeBranch,
				// Actions
				updateActiveContributor: handleUpdateActiveContributor,
				updateActiveBranch: handleUpadteActiveBranch,
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
