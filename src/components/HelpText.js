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

  // --- Invoke server function in ./apps-script/main.js to query play timing from google sheet -- //
  queryTiming = () => {
    serverFunctions.querySpreadSheetData("game-result", "klotski")
        .then((response) => this.setState({result: response}))
        .catch((err) => alert(err));
  }

  handleClose = () => {
    this.props.onClose();
  }

  render() {
    const { classes, onClose, ...other } = this.props
    this.queryTiming()
    return (
      <Dialog onClose={this.handleClose} {...other}>
        <Grid className={classes.helpContents} container justify="center" direction="column" alignItems="center">
          <div>Your Timings (sec)</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.result}
          </div>
        </Grid>
      </Dialog>
    )
  }
}

HelpText = withStyles(styles)(HelpText)
export default HelpText
