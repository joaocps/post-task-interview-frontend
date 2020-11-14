import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import {red, blue, green} from "@material-ui/core/colors";
import {AutoRotatingCarousel, Slide} from "material-auto-rotating-carousel";
import Menu from '@material-ui/core/Menu';
import {keys} from "@material-ui/core/styles/createBreakpoints";
import Modal from '@material-ui/core/Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';

import DialogSelect from "./TileEditRemove";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

const API_URL = `http://127.0.0.1:8000`;

const useStyles = makeStyles((theme) => ({
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    cardHeader: {
        bg: "black",
    },
    postTitle: {
        fontSize: '16px',
        textAlign: 'left',
    },
    postText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        fontSize: '16px',
        textAlign: 'left',
        marginBottom: theme.spacing(1),
    },
}));

const Tiles = (props) => {
    const {tiles, tasks, getTilesAndTasks} = props;
    const classes = useStyles();
    const [filter, setFilter] = useState('all');
    const filteredTiles = filter === "all" ? tiles : tiles.filter((tile) => tile.status === filter);

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    if (!tiles || tiles.length === 0) return <p>Can not find any tiles, sorry !</p>;
    return (
        <React.Fragment>
            <Container maxWidth="md" component="main">
                <div>
                    <InputLabel id="states"></InputLabel>
                    <Select
                        labelId="tileStates"
                        id="states"
                        value={filter}
                        onChange={handleChange}
                    >
                        <MenuItem value={"all"}>All</MenuItem>
                        <MenuItem value={"Live"}>Live</MenuItem>
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Archived"}>Archived</MenuItem>
                    </Select>
                    <p></p>
                </div>
                <Grid container spacing={5} alignItems="flex-end">
                    {filteredTiles.map((tile) => {
                        const tileTasks = tasks.filter((task) => {
                            return tile.id === task.tile;
                        });
                        return (
                            <GridItem
                                tile={{...tile}}
                                classes={classes}
                                tileTasks={tileTasks}
                                getTilesAndTasks={getTilesAndTasks}
                            />
                        );
                    })}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

const GridItem = ({
                      tile,
                      classes,
                      tileTasks,
                      getTilesAndTasks,
                  }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function editTile(tile, state) {
        let body = {
            "id": tile.id,
            "launch_date": tile.launch_date,
            "status": state
        };
        fetch(API_URL + "/tile/" + tile.id + "/", {
            method: "put",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('error edit tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function deleteTile(tile_id) {
        fetch(API_URL + "/tile/" + tile_id + "/", {
            method: "delete",
            headers: {'Content-Type': 'application/json'},
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Error deleting tile");
                    throw new Error('error deleting tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function renderSwitch(param) {
        switch (param) {
            case 'Live':
                return '#9ccc65';
            case 'Archived':
                return '#e57373';
            case 'Pending':
                return '#fff176';
            default:
                return 'green';
        }
    }

    return (
        // Enterprise card is full width at sm breakpoint
        <>

            <Grid item key={tile.launch_date} xs={12} md={4}>
                <Card className={classes.card}>
                    <CardHeader
                        style={{backgroundColor: renderSwitch(tile.status)}}
                        avatar={
                            <Avatar aria-label="CardType" className={classes.avatar}>
                                {tileTasks.length}
                            </Avatar>
                        }
                        action={
                            <div>
                                <Button
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon/>
                                </Button>
                                <Menu
                                    id="change-tile"
                                    keepMounted
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            editTile(tile, "Live");

                                        }}
                                    >
                                        Set Live
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            editTile(tile, "Pending");
                                        }}
                                    >
                                        Set Pending
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            editTile(tile, "Archived");
                                        }}
                                    >
                                        Set Archived
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            deleteTile(tile.id);
                                        }}
                                    >
                                        Delete Tile
                                    </MenuItem>
                                </Menu>
                            </div>
                        }
                        title={tile.status}
                        subheader={tile.launch_date.split("T")[0]}
                    />
                    <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                            className={classes.postTitle}
                        >
                            {/*{tile.status}*/}
                        </Typography>
                        <div className={classes.postText}>
                            <AutoRotatingCarouselModal
                                tasks={tileTasks}
                                tile={tile}
                                getTilesAndTasks={getTilesAndTasks}
                            />
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            {/*<button onClick={() => {*/}
            {/*    editTile(tile, "Pending")*/}
            {/*}}>Button</button>*/}
        </>
    );
};


const AutoRotatingCarouselModal = (props) => {
    const {tasks, tile, getTilesAndTasks} = props;
    const [handleOpen, setHandleOpen] = useState({open: false});
    const [handleAlertOpen, setHandleAlertOpen] = useState({open: false});
    const [open, setOpen] = useState(false);
    const [taskType, setTaskType] = useState('Discussion');
    const [title, setTitle] = useState();
    const [order, setOrder] = useState();
    const [description, setDescription] = useState();

    const taskTypes = [
        {
            value: 'Discussion',
            label: 'Discussion',
        },
        {
            value: 'Diary',
            label: 'Diary',
        },
        {
            value: 'Survey',
            label: 'Survey',
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTypeChange = (event) => {
        setTaskType(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    function setDefaultValues(title, order, description) {
        setTitle(title);
        setOrder(order);
        setDescription(description);
    }

    function createTask(tile_id, title, order, description, task_type) {
        let body = {
            "tile": tile_id,
            "title": title,
            "order": order,
            "description": description,
            "task_type": task_type
        };
        fetch(API_URL + "/task/", {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Error creating task!");
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function editTask(task_id, tile_id, title, order, description, task_type) {
        let body = {
            "id": task_id,
            "tile": tile_id,
            "title": title,
            "order": order,
            "description": description,
            "task_type": task_type
        };
        console.log(body)
        fetch(API_URL + "/task/" + task_id + "/", {
            method: "put",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Error editing task");
                    throw new Error('error editing task')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    function deleteTask(task_id) {
        fetch(API_URL + "/task/" + task_id + "/", {
            method: "delete",
            headers: {'Content-Type': 'application/json'},
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Error deleting task");
                    throw new Error('error creating tile')
                }
                return getTilesAndTasks();
            })
            .catch((error) => console.error(error));
    }

    return (
        <div>
            <Button
                style={{backgroundColor: "aliceblue", textAlign: "center"}}
                onClick={() => {
                    setHandleOpen({open: true})
                }}
            >
                View Tasks
            </Button>
            <div className={"task"}>
                <AutoRotatingCarousel
                    label="Close"
                    open={handleOpen.open}
                    onClose={() => setHandleOpen({open: false})}
                    onStart={() => setHandleOpen({open: false})}
                    autoplay={false}
                    mobile={false}
                    style={{position: "absolute"}}
                >

                    {tasks.map((task) => {
                        return (
                            <Slide
                                key={task.tile}
                                media={
                                    <img src="https://source.unsplash.com/random" alt="rdm"/>
                                }
                                mediaBackgroundStyle={
                                    "Diary" === task.task_type
                                        ? {backgroundColor: red[300]}
                                        : {backgroundColor: blue[300]}
                                }
                                style={
                                    "Diary" === task.task_type
                                        ? {backgroundColor: red[400]}
                                        : {backgroundColor: blue[400]}
                                }
                                title={
                                    <div>
                                        {task.title}
                                        <Button size={"small"} color="primary" onClick={ () => {handleClickOpen(); setDefaultValues(task.title, task.order, task.description)}}>
                                            <EditIcon style={{fill: "white"}}/>
                                        </Button>

                                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                            <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Please edit the parameters you need to update the task.
                                                </DialogContentText>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="title"
                                                    label="Title"
                                                    type="task_title"
                                                    onChange={handleTitleChange}
                                                    defaultValue={task.title}
                                                    fullWidth
                                                />
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="order"
                                                    label="Order"
                                                    type="task_order"
                                                    onChange={handleOrderChange}
                                                    defaultValue={task.order}
                                                    fullWidth
                                                />
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="description"
                                                    label="Description"
                                                    type="task_description"
                                                    onChange={handleDescriptionChange}
                                                    defaultValue={task.description}
                                                    fullWidth
                                                />
                                                <TextField
                                                    id="standard-select-type"
                                                    select
                                                    label=" "
                                                    value={taskType}
                                                    onChange={handleTypeChange}
                                                    defaultValue={task.task_type}
                                                    helperText="Please select the task type."
                                                >
                                                    {taskTypes.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => {
                                                    handleClose();
                                                    editTask(task.id, tile.id, title, order, description, taskType)
                                                }} color="primary">
                                                    Update Task
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        <Button size={"small"} onClick={() => {
                                            deleteTask(task.id)
                                        }}><DeleteIcon style={{fill: "white", marginLeft: -40}}/></Button>
                                    </div>}
                                subtitle={<div><p>{task.task_type}</p><p>{task.description}</p></div>}


                            />

                        )
                    })}
                    <Slide
                        media={
                            <img src="https://source.unsplash.com/random" alt="rdm"/>
                        }
                        mediaBackgroundStyle={{backgroundColor: blue[300]}}
                        style={{backgroundColor: blue[400]}}
                        title=" "
                        subtitle={
                            <div>
                                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                                    Create Task
                                </Button>

                                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Please enter all parameters to create a new task.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="title"
                                            label="Title"
                                            type="task_title"
                                            onChange={handleTitleChange}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="order"
                                            label="Order"
                                            type="task_order"
                                            onChange={handleOrderChange}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="description"
                                            label="Description"
                                            type="task_description"
                                            onChange={handleDescriptionChange}
                                            fullWidth
                                        />
                                        <TextField
                                            id="standard-select-type"
                                            select
                                            label=" "
                                            value={taskType}
                                            onChange={handleTypeChange}
                                            helperText="Please select the task type."
                                        >
                                            {taskTypes.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={() => {
                                            handleClose();
                                            createTask(tile.id, title, order, description, taskType)
                                            // createTask("body")
                                        }} color="primary">
                                            Add new task
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>}
                        // subtitle={<Button variant={"contained"} size={"large"} onClick={() => {FormDialog()}}>Create Task</Button>}
                    >
                    </Slide>
                </AutoRotatingCarousel>
            </div>
        </div>
    );
};


export default Tiles;
