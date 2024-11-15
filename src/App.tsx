import './App.css'
import Onboard from './features/Onboard';

function App() {
	
	const token = 'token';

	return (
		<>
			<Onboard isToken={Boolean(token)} />
		</>
	);
};

export default App
