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
import DialogSelect from "./TileEditRemove";


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
    const {tiles, tasks} = props;
    const classes = useStyles();
    // const [filter, setFilter] = useState("all");
    const [filter, setFilter] = useState('all');

    const filteredTiles = filter === "all" ? tiles : tiles.filter((tile) => tile.status === filter);

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

    // const [filter, setFilter] = useState('All Tiles');

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
                            return tile.id === task.tile
                        });
                        return (
                            // Enterprise card is full width at sm breakpoint
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
                                            // <IconButton onClick={() => this.createTask({"status": "Pending"})}
                                            //             aria-label="settings">
                                            //     <MoreVertIcon />
                                            // </IconButton>
                                            <IconButton onClick={() => DialogSelect()}
                                                        aria-label="settings">
                                                <MoreVertIcon/>
                                            </IconButton>
                                            // <Button aria-controls="simple-menu" aria-haspopup="true"
                                            //         onClick={DialogSelect}>
                                            //     <MoreVertIcon/>
                                            // </Button>
                                            // <IconButton onClick={() => {DialogSelect()}} aria-label="add"><AddIcon/></IconButton>
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
                                            <AutoRotatingCarouselModal tasks={tileTasks}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

const AutoRotatingCarouselModal = ({tasks}) => {
    const [handleOpen, setHandleOpen] = useState({open: false});
    const [handleAlertOpen, setHandleAlertOpen] = useState({open: false});

    return (
        <div>
            <Button
                style={{backgroundColor: "aliceblue", textAlign: "center"}}
                onClick={() => {
                    tasks.length === 0 ? setHandleAlertOpen({open: true}) : setHandleOpen({open: true})
                }}
            >
                View Tasks
            </Button>
            {handleAlertOpen.open && <Alert severity="error">No tasks</Alert>}
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
                                key={task.order}
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
                                title={task.title + " " + task.order}
                                subtitle={<div><p>{task.task_type}</p><p>{task.description}</p></div>}
                            />
                        );
                    })}
                </AutoRotatingCarousel>
            </div>
        </div>
    );
};


export default Tiles;
