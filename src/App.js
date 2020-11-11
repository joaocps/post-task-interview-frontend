import React, { useEffect, useState } from 'react';
import './App.css';
import Tiles from './components/Tiles';
import PostLoadingComponent from './components/TileDataLoading';

function App() {
	const PostLoading = PostLoadingComponent(Tiles);
	const [appState, setAppState] = useState({
		loading: false,
		tiles: null,
		tasks: null,
	});

	useEffect(() => {
		setAppState({tiles: null, loading: true, tasks: null});
		const apiUrl = `http://127.0.0.1:8000`;
		fetch(apiUrl + '/tile/')
			.then((data) => data.json())
			.then((tiles) => {
				fetch(apiUrl + '/task/')
					.then((data) => data.json())
					.then((tasks) => {
						setAppState({ tiles: tiles, loading: false, tasks: tasks});
					});
			});
	}, [setAppState]);
	return (
		<div className="App">
			<h1>Current Tiles</h1>
			<PostLoading isLoading={appState.loading} tiles={appState.tiles} tasks={appState.tasks}/>
		</div>
	);
}
export default App;