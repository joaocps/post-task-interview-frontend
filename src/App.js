import React, {useEffect, useState} from 'react';
import './App.css';
import Tiles from './components/Tiles';
import PostLoadingComponent from './components/TileDataLoading';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const API_URL = `http://127.0.0.1:8000`;

function App() {
    const PostLoading = PostLoadingComponent(Tiles);
    const [appState, setAppState] = useState({
        loading: false,
        tiles: null,
        tasks: null,
    });

    function createTile(body) {
        fetch(API_URL + "/tile/", {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function editTile(id_pk, body) {
        fetch(API_URL + "/tile/" + id_pk, {
            method: "put",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function editTask(id_pk, body) {
        fetch(API_URL + "/task/" + id_pk, {
            method: "put",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }


    function createTask(body) {
        fetch(API_URL + "/task/", {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function getTilesAndTasks() {
        fetch(API_URL + "/tile/")
            .then((data) => data.json())
            .then((tiles) => {
                fetch(API_URL + "/task/")
                    .then((data) => data.json())
                    .then((tasks) => {
                        setAppState({tiles: tiles, loading: false, tasks: tasks});
                    });
            });
    }


    useEffect(() => {
        setAppState({tiles: null, loading: true, tasks: null});
        const apiUrl = `http://127.0.0.1:8000`;
        fetch(apiUrl + '/tile/')
            .then((data) => data.json())
            .then((tiles) => {
                fetch(apiUrl + '/task/')
                    .then((data) => data.json())
                    .then((tasks) => {
                        setAppState({tiles: tiles, loading: false, tasks: tasks});
                    });
            });
    }, [setAppState]);
    return (
        <div className="App">
            <h1>
                Current Tiles <IconButton onClick={() => createTile({"status": "Pending"})} aria-label="add"><AddIcon/></IconButton>
            </h1>

            <PostLoading isLoading={appState.loading} tiles={appState.tiles} tasks={appState.tasks} getTilesAndTasks={getTilesAndTasks}/>
        </div>
    );
}

export default App;