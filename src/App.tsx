import { useState } from 'react';
import './App.css'
import Onboard from './features/Onboard';

function App() {
    const [isToken, setIsToken] = useState(false);
    const onClick = () => setIsToken(true); 
	
	return (
		<>
			<div className="btn">
                <button onClick={onClick}>🔒 Авторизая</button>
			</div>
			<div className="control">
                <button data-action="mapping.click">⬅️ В лево</button>
                <button data-action="mapping.click">В перед ⬆️</button>
                <button data-action="mapping.click">В право ➡️</button>
            </div>
			<Onboard isLogin={isToken} />
		</>
	);
};

export default App
