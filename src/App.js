import React, { Component } from 'react';
import {Grid, Button, withStyles, Modal} from '@material-ui/core'
import GridLayout from "react-grid-layout";
import HelpText from './components/HelpText'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { GASClient } from 'gas-client';

// --- Enable invoking server functions in ./apps-script/main.js from the client --- //
const { serverFunctions } = new GASClient();

// --- Icon used by the square grid --- //
const gridIcon = 'https://cdn-icons-png.flaticon.com/512/5853/5853902.png'

// --- Icon of the background --- //
const bgImage = 'https://cdn-icons-png.flaticon.com/512/2220/2220091.png'

const layout = [
    {i: "0", x: 0, y: 0, w: 1, h: 2, name: ""},
    {i: "1", x: 1, y: 0, w: 2, h: 2, name: "(ᵔᴥᵔ)"},
    {i: "2", x: 3, y: 0, w: 1, h: 2, name: ""},
    {i: "3", x: 0, y: 2, w: 1, h: 1, name: ""},
    {i: "4", x: 1, y: 2, w: 1, h: 1, name: ""},
    {i: "5", x: 2, y: 2, w: 1, h: 1, name: ""},
    {i: "6", x: 3, y: 2, w: 1, h: 1, name: ""},
    {i: "7", x: 0, y: 3, w: 1, h: 1, name: ""},
    {i: "8", x: 1, y: 3, w: 1, h: 1, name: ""},
    {i: "9", x: 2, y: 3, w: 1, h: 1, name: ""},
    {i: "10", x: 3, y: 3, w: 1, h: 1, name: ""},
    {i: "11", x: 0, y: 4, w: 1, h: 1, name: ""},
    {i: "12", x: 3, y: 4, w: 1, h: 1, name: ""},
]

const originalLayout = getFromLS("layout") || Object.assign([],layout);
const originalDuration = getFromLS("playDuration") || 0;

const styles = {
    wrapper: {
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },

    frame : {
        border : "1px solid black",
        width: '100%',
        height: '800px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: "rgba(249, 249, 97, 0.5)",
        overflow: "hidden",
    },

    help: {
        "&:hover" : {
            cursor: 'pointer',
            filter: "brightness(120%)"
        },
        color: "black",
        margin: "5px 0 0 0",
        fontSize: "2em",
    },

    grid : {
        '&:hover': {
            cursor: 'pointer',
            filter: "brightness(120%)"
        },
        fontFamily: 'wt034',
        boxShadow: "2px 2px 3px black",
        borderRadius: "2px",
        boxSizing: "border-box",
        backgroundImage : `url(${gridIcon})`,
        fontSize: "3em",
        color: "#202020",
        textShadow: "1px 1px 1px #ccc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },

    sBlock: {
        fontSize: "1.5em",
        color: "#3d2b20",
        textShadow: "1px 1px 1px white",
    },

    wBlock: {
        textShadow: "1px 1px 1px blue",
    },

    vBlock: {
        textShadow: "1px 1px 1px yellow",
    },

    bBlock: {
        fontSize: "6em",
        color: '#e04c23',
        textShadow: "2px 2px 1px black"
    },

    button : {
        '&:hover': {
            cursor: 'pointer',
        },
        marginTop: "10px",
        fontSize: "12px",
    },

    nonfreedom: {
        margin: "0",
        color: "green",
        opacity: "0.8",
        textShadow: "1px 1px 1px black"
    },

    freedom: {
        margin: "0",
        color: "green",
        filter: "brightness(150%)",
        textShadow: "1px 1px 1px black"
    },

    modalScreen: {
        minHeight: "100vh",
        backgroundColor: "rgba(255,255,255,0.7)",
    },

    modalContent : {
        width: "430px",
        height: "300px",
        textAlign: "center",
    }
}

function getFromLS (key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("klotski")) || {};
        } catch (e) {
            alert(e)
        }
    }
    return ls[key];
}

function saveToLS (key, value) {
    if (global.localStorage) {
        global.localStorage.setItem("klotski", JSON.stringify({[key]: value}))
    }
}

class App extends Component {
    targetElement = null;
    playTimerCounter = null;

    constructor(props) {
        super(props)
        this.state = {
            layout: JSON.parse(JSON.stringify(originalLayout)),
            prevLayout: [],
            dragged: null,
            win: false,
            helpOpen: false,
            playDuration: originalDuration
        }
    }

    componentDidMount() {
        this.targetElement = document.querySelector('#mainPanel');
        disableBodyScroll(this.targetElement);
        this.setState({playDuration: 0})
        this.playTimerCounter = setInterval(() => {
            this.setState({playDuration: this.state.playDuration + 1})
            saveToLS("playDuration", this.state.playDuration)
        }, 1000)
    }

    componentWillUnmount() {
        clearAllBodyScrollLocks();
        if (this.playTimerCounter) {
            clearInterval(this.playTimerCounter)
            this.setState({playDuration: 0})
            saveToLS("playDuration", this.state.playDuration)
        }
    }

    onLayoutChange = layout => {
        const dragged = this.state.dragged
        if (dragged) {
            const currentLayout = layout.slice(0,13)
            const newItem = currentLayout[dragged]
            const oldItem = this.state.prevLayout[dragged]
            if (newItem.x !== oldItem.x || newItem.y !== oldItem.y) {
                if (Math.abs(newItem.x - oldItem.x) > 1 ||
                    Math.abs(newItem.y - oldItem.y) > 1 ||
                    (Math.abs(newItem.x - oldItem.x) >=1 && Math.abs(newItem.y - oldItem.y) >= 1)) {
                    global.location.reload()
                } else {
                    let win = false
                    if (newItem.i === "1" && newItem.x === 1 && newItem.y === 3) {
                        win = true
                        this.saveTiming()
                        clearInterval(this.playTimerCounter)
                    }
                    this.setState({layout: currentLayout, win: win})
                    saveToLS("layout", currentLayout)
                }
            }
        }
    }

    onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
        this.setState({
            prevLayout : Object.assign([], layout.slice(0,13))
        })
    }

    onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
        this.setState({
            dragged: parseInt(newItem.i)
        })
    }

    openHelp = () => {
        this.setState({
            helpOpen: true
        })
    }

    handleClose = () => {
        this.setState({ helpOpen: false })
    }

    // --- Invoke server function in ./apps-script/main.js to append play timing to google sheet -- //
    saveTiming = () => {
        serverFunctions.appendSpreadSheetData("game-result", "klotski", this.state.playDuration)
    }

    reset = e => {
        this.setState({
            layout: Object.assign([], layout),
            playDuration: 0,
            win: false
        })
        global.localStorage.clear()
    }

    render() {
        const {classes} = this.props
        return (
            <Grid container direction="column" justify="flex-start" alignItems="center" className={classes.wrapper} id="mainPanel">
                <Grid container justify="flex-start" className={classes.frame}>
                    <GridLayout layout={this.state.layout} cols={4} rowHeight={140} width={560} margin={[1,1]}
                                containerPadding = {[0,0]} isResizable={false} preventCollision={true}
                                compactType={null} onLayoutChange={this.onLayoutChange} onDragStart={this.onDragStart}
                                onDragStop={this.onDragStop} draggableHandle=".moving-grid">
                        {layout.map((block, i) => {
                            const classTag = ([0,2].includes(i) ?
                                classes.vBlock : ([3,4,5,6,7,8,9,10,11,12].includes(i) ? classes.wBlock : classes.bBlock))
                            return (
                                <div className={this.state.win ? [classes.grid, classTag] : [classes.grid, "moving-grid", classTag]} key={block.i}>{block.name}</div>
                            )}
                        )}
                        <div key="z" data-grid={{x: 0, y: 5, w: 4, h: 3, static: true}}></div>
                    </GridLayout>
                </Grid>
                <Grid container justify="flex-start" direction="column" alignItems="flex-start">
                    <div style={{marginLeft: "200px"}}>
                        <h3 className={this.state.win ? classes.freedom : classes.nonfreedom} style={{marginLeft: "68px", marginTop: "-80px"}}><i>EXIT</i></h3>
                        <h2 style={{marginLeft: "20px", color: "#008C55"}}>Time (Sec): {this.state.playDuration}</h2>
                        <div align="left">
                            <Button variant="contained" className={classes.button} onClick={this.reset}>
                                Reset
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="contained" className={classes.button} onClick={this.openHelp}>
                                Your Timings
                            </Button>
                        </div>
                    </div>
                </Grid>
                <Modal open={this.state.win}>
                    <Grid container direction="column" justify="center" alignItems="center" className={classes.modalScreen}>
                        <Grid container direction="column" justify="center" alignItems="center" className={classes.modalContent}>
                            <div>
                                <h3>You helped the Pet get freedom!</h3>
                                <h3>You are the hero!</h3>
                                <h3>Your Timings: {this.state.playDuration} seconds</h3>
                            </div>
                            <Button style={{marginTop:"50px"}} variant="contained" color="primary" onClick={this.reset}>
                                Replay
                            </Button>
                        </Grid>
                    </Grid>
                </Modal>
                <HelpText open={this.state.helpOpen} onClose={this.handleClose} />
            </Grid>
        );
    }
}

App = withStyles(styles)(App)
export default App;
