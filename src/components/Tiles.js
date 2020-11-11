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

import Button from "@material-ui/core/Button";
import {red, blue, green} from "@material-ui/core/colors";
import {AutoRotatingCarousel, Slide} from "material-auto-rotating-carousel";

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

    function renderSwitch(param) {
        switch(param) {
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

    if (!tiles || tiles.length === 0) return <p>Can not find any tiles, sorry !</p>;
    return (
        <React.Fragment>
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {tiles.map((tile) => {
                        const tileTasks = tasks.filter((task) => {
                            return tile.id === task.tile
                        });
                        return (
                            // Enterprise card is full width at sm breakpoint
                            <Grid item key={tile.launch_date} xs={12} md={4}>
                                <Card className={classes.card}>
                                    <CardHeader

                                        style={{ backgroundColor: renderSwitch(tile.status) }}
                                        avatar={
                                          <Avatar aria-label="CardType" className={classes.avatar}>
                                            T
                                          </Avatar>
                                        }
                                        action={
                                          <IconButton aria-label="settings">
                                            <AddIcon />
                                          </IconButton>
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
    return (
        <div>
            <Button style={{backgroundColor: 'aliceblue', textAlign:'center' }} onClick={() => setHandleOpen({open: true})}>View
                Tasks</Button>
            {tasks.map((task) => {
                return (
                    <div className={"task"} key={task.order}>
                        <AutoRotatingCarousel
                            label="Close"
                            open={handleOpen.open}
                            onClose={() => setHandleOpen({open: false})}
                            onStart={() => setHandleOpen({open: false})}
                            autoplay={true}
                            mobile={false}
                            style={{position: "absolute"}}
                        >
                            <Slide
                                media={
                                    <img src="https://source.unsplash.com/random" alt="rdm"/>
                                }
                                mediaBackgroundStyle={"Diary" === task.task_type ? {backgroundColor: red[300]} : {backgroundColor: blue[300]}}
                                style={"Diary" === task.task_type ? {backgroundColor: red[400]} : {backgroundColor: blue[400]}}
                                title="This is a very cool feature"
                                subtitle="adsadasd"

                            />
                            {/*<Slide*/}
                            {/*    media={*/}
                            {/*        <img src="https://source.unsplash.com/random" alt="rdm"/>*/}
                            {/*    }*/}
                            {/*    mediaBackgroundStyle={{backgroundColor: blue[400]}}*/}
                            {/*    style={{backgroundColor: blue[600]}}*/}
                            {/*    title="Ever wanted to be popular?"*/}
                            {/*    subtitle="Well just mix two colors and your are good to go!"*/}
                            {/*/>*/}
                            {/*<Slide*/}
                            {/*    media={*/}
                            {/*        <img src="https://source.unsplash.com/random" alt="rdm"/>*/}
                            {/*    }*/}
                            {/*    mediaBackgroundStyle={{backgroundColor: green[400]}}*/}
                            {/*    style={{backgroundColor: green[600]}}*/}
                            {/*    title="May the force be with you"*/}
                            {/*    subtitle="The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe."*/}
                            {/*/>*/}
                        </AutoRotatingCarousel>
                    </div>
                );
            })}
        </div>
    );
};

export default Tiles;
