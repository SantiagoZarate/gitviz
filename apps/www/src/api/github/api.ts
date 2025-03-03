import { cleanEmail } from '@/helpers/clean-email';
import type { Contributor } from '@/lib/git-schema';
import type { GithubProfile } from './api.type';

type getUserInfoProps = {
	contributors: Contributor[];
};

export const githubAPI = {
	async getUsersInfo({ contributors }: getUserInfoProps) {
		// Filter out GitHub's anonymous emails

		// Build a single GraphQL query
		let query = 'query {';
		contributors.forEach(({ email, name }) => {
			query += ` ${cleanEmail(email)}: search(query: "in:login ${name}", type: USER, first: 1) { nodes { ... on User { avatarUrl login } } }`;
		});
		query += ' }';

		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query }),
		};

		try {
			const response = await fetch(
				'https://api.github.com/graphql',
				fetchOptions,
			);
			if (!response.ok) {
				const responseBody = await response.json();
				throw new Error(responseBody.message);
			}

			const responseBody: GithubReponse = await response.json();

			console.log({ responseBody });

			return responseBody;
		} catch (error) {
			console.log({ error });
		}
	},
};

type GithubReponse = {
	data: {
		[key: string]: {
			nodes: GithubProfile[];
		};
	};
};
