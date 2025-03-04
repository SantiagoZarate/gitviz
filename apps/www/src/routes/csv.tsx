import { parseCSV } from '@/helpers/parse-csv';
import { createFileRoute } from '@tanstack/react-router';
import LZString from 'lz-string';

export const Route = createFileRoute('/csv')({
	component: RouteComponent,
});
const compressedCsv =
	'OYSwLgbiBeA0C2BDAzmApgJ1gHwMqIDswRFgB7ALUQ0XVmUONLICYAGNgRmmtrQAFgSEABsAdAGMy8WABYArF1gB2FiwDMsFgDYAHLJydlszqYCcnE4eOnOFtsusnTu9Xqe3XnTdiPPOumza2h6mwZwsoZzaLKZRsrryjr42bAlsZiEpJmmBLAbZnGnyLMrJfkXqZupJHmwsJWYFFfUl7HUNbLpZLfn5zakarj2DNeq6HQ2Jk+osZpNzkYX1lvLzy9FDdZzyJRMb6rNLfhnKim5Op7LasgOyGXoJnJeZXncPuqXrJ5nKFsfGB7KT4je6ZbQ2F7aIyBKE7bRsKFdIpI5SHJEQgFgtbqe4vNZsEr45R2UEZJLI-HBVRUsy7KmYhk07LkpLqREsukNfIvWRVeQ+H4mAVYjK4ozyF6HeTab6A3ReMxy+4K9kKy4KhrRDXKbSHfYnXS6mE65wcw2A9wso0sT7KrqqRT2m0KQXy5QZWHWvRzZ0+owaiFKsndD1mA3yiFcZ7evS6GOG4Ls8qRmJqQNrWR+tnZx4ZhwJyM1GUa2RlNGl4yZSt+UsQmKl+Q7Z18vmS618-WltQRDVcMwOS5-RI7If6Nz24E7XVD0xrdsnEneWaXPRNissvSEgKrs6xUXBI181feW3vaG+yJAA';
const compressedCsv2 =
	'OYSwLgbiBeA0C2BDAzmApgJ1gHwMqIDswRFgB7ALUQ0XVmUONLICYAGNgRmmtrQAFgSEABsAdAGMy8WABYArF1gB2FiwDMsFgDYAHLJydlszqYCcnE4eOnOFtsusnTu9Xqe3XnTdiPPOumza2h6mwZwsoZzaLKZRsrryjr42bAlsZiEpJmmBLAbZnGnyLMrJfkXqZupJHmwsJWYFFfUl7HUNbLpZLfn5zakarj2DNeq6HQ2Jk+osZpNzkYX1lvLzy9FDdZzyJRMb6rNLfhnKim5Op7LasgOyGXoJnJeZXncPuqXrJ5nKFsfGB7KT4je6ZbQ2F7aIyBKE7bRsKFdIpI5SHJEQgFgtbqe4vNZsEr45R2UEZJLI-HBVRUsy7KmYhk07LkpLqREsukNfIvWRVeQ+H4mAVYjK4ozyF6HeTab6A3ReMxy+4K9kKy4KhrRDXKbSHfYnXS6mE65wcw2A9wso0sT7KrqqRT2m0KQXy5QZWHWvRzZ0+owaiFKsndD1mA3yiFcZ7evS6GOG4Ls8qRmJqQNrWR+tnZx4ZhwJyM1GUa2RlNGl4yZSt+UsQmKl+Q7Z18vmS618-WltQRDVcMwOS5-RI7If6Nz24E7XVD0xrdsnEneWaXPRNissvSEgKrs6xUXBI181feW3vaG+pYAKUIaAAImQ0LAAFa3gAmj-4aAAHoh4AAHEQ0EkaRYCqDhYHke5EXYCDCnMDhzRsFxFCQ-xAjgipTDOTDkKMRDYAAWAAKCAA';

function RouteComponent() {
	const decompressCsv =
		LZString.decompressFromEncodedURIComponent(compressedCsv2);

	const data = parseCSV(decompressCsv);

	console.log({ data });

	return <div>Testeando csv</div>;
}
