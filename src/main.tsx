import { NuqsAdapter } from 'nuqs/adapters/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { GitContextProvider } from './context/global-context.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<NuqsAdapter>
			<GitContextProvider>
				<App />
			</GitContextProvider>
		</NuqsAdapter>
	</StrictMode>,
);
