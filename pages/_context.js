import { useState, createContext, useContext } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
	
	const [error, setError] = useState('')

	const newError = (error) => {
		setError(error)
	}

	let sharedState = {
		error,
		newError,
	}

	return (
		<AppContext.Provider value={sharedState}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}