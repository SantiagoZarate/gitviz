import { type Contributor, gitSchema } from '@/lib/git-schema';
import { parseAsJson, useQueryState } from 'nuqs';
import { type PropsWithChildren, createContext, useContext } from 'react';

interface State {
	contributors: Contributor[];
	title: string;
}

interface Actions {
	a: () => void;
}

type GitContextProps = State & Actions;

const gitContext = createContext<GitContextProps | null>(null);

export function GitContextProvider({ children }: PropsWithChildren) {
	const [json] = useQueryState('json', parseAsJson(gitSchema.parse));

	if (!json) {
		return;
	}

	return (
		<gitContext.Provider
			value={{
				contributors: json?.co,
				title: json.t,
				a() {
					console.log('hola');
				},
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
