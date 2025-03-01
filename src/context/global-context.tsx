import { type Contributor, gitSchema } from '@/lib/git-schema';
import { parseAsJson, useQueryState } from 'nuqs';
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
}

interface Actions {
	deleteContributor: (name: string) => void;
	updateActiveContributor: (name: string) => void;
}

type GitContextProps = State & Actions;

const gitContext = createContext<GitContextProps | null>(null);

export function GitContextProvider({ children }: PropsWithChildren) {
	const [json, setJson] = useQueryState('json', parseAsJson(gitSchema.parse));
	const [activeContributor, setActiveContributor] =
		useState<Contributor | null>(null);

	if (!json) {
		return;
	}

	const handleRemoveContributor = (name: string) => {
		setJson((prevState) => {
			const filteredContributors = prevState?.co.filter((co) => co.n !== name);

			return {
				co: filteredContributors ?? [],
				t: prevState!.t,
			};
		});
	};

	const handleUpdateActiveContributor = (name: string) => {
		setActiveContributor((prevState) => {
			if (prevState?.n === name) {
				return null;
			}

			return json.co.find((c) => c.n === name)!;
		});
	};

	return (
		<gitContext.Provider
			value={{
				// States
				contributors: json?.co,
				activeContributor,
				title: json.t,
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
