import React, { Component } from 'react';
import {Grid, withStyles, Dialog, DialogTitle} from '@material-ui/core'
import {GASClient} from "gas-client";

const { serverFunctions } = new GASClient();

const styles = {
  helpContents: {
    padding: "15px",
  }
}

class HelpText extends Component {

  constructor(props) {
    super(props)
    this.state = {
      result: ""
    }
  }

  componentDidMount() {
    this.queryTiming()
  }

  // --- Invoke server function in ./apps-script/main.js to query play timing from google sheet -- //
  queryTiming = () => {
    serverFunctions.querySpreadSheetData("game-result", "klotski")
        .then((response) => this.setState({result: response}))
        .catch((err) => alert(err));
  }

  handleClose = () => {
    this.props.onClose();
  }

  concatStrings = (dataArray) => {
    var result = "";
    for (var i = 0; i < dataArray.length; i++) {
      for (var j = 0; j < dataArray[i].length; j++) {
        if (dataArray[i][j]) {
          result = result + dataArray[i][j] + ' '
        }
      }
      result = result + "\n"
    }
    return result;
  }

  arrayColumn = (array, column) => array.map(e => e[column]);

  worstTiming = (dataArray) => {
    if (dataArray.length > 0 && dataArray[0].length > 0) {
      const arr = this.arrayColumn(dataArray, 0)
      return arr.reduce((r, b) => Math.max(r, b), Number.NEGATIVE_INFINITY);
    } else {
      return 0
    }
  }

  bestTiming = (dataArray) => {
    if (dataArray.length > 0 && dataArray[0].length > 0) {
      const arr = this.arrayColumn(dataArray, 0)
      return arr.reduce((r, b) => Math.min(r, b), Number.POSITIVE_INFINITY);
    } else {
      return 0
    }
  }

  averageTiming = (dataArray) => {
    if (dataArray.length > 0 && dataArray[0].length > 0) {
      const arr = this.arrayColumn(dataArray, 0)
      return arr.reduce((a, b) => a + b, 0) / arr.length
    } else {
      return 0;
    }
  }

  render() {

    console.log(Math.min([1,2,3,4]))

    const { classes, onClose, ...other } = this.props
    return (
      <Dialog onClose={this.handleClose} {...other}>
        <Grid className={classes.helpContents} container justify="center" direction="column" alignItems="center">
          <h3>Your Timings (sec)</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {this.concatStrings(this.state.result)}
          </div>
          <h3>Timing Statistic</h3>
          <div style={{alignItems: "center"}}>
            Best Timing: {this.bestTiming(this.state.result)} <br />
            Worst Timing: {this.worstTiming(this.state.result)} <br />
            Average Timing: {this.averageTiming(this.state.result)} <br />
          </div>
        </Grid>
      </Dialog>
    )
  }
}

HelpText = withStyles(styles)(HelpText)
export default HelpText
