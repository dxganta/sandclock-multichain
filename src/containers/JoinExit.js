import React from "react";
import { withStore } from "@spyna/react-store";
import { withStyles } from "@material-ui/styles";
import theme from "../theme/theme";
import { WadDecimal, getData, toChai, toDai } from "../utils/web3Utils";
import { join, exit } from "../actions/main";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = () => ({
  card: {
    marginBottom: theme.spacing(6),
  },
  input: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  actionButton: {
    marginTop: theme.spacing(2),
    margin: "0px auto",
  },
  accountBalance: {
    float: "right",
  },
});

class JoinExitContainer extends React.Component {
  async componentDidMount() {
    // update data periodically
    this.watchData();
  }

  async watchData() {
    await getData.bind(this)();
    setInterval(() => {
      getData.bind(this)();
    }, 10 * 1000);
  }

  join() {
    join.bind(this)();
  }

  exit() {
    exit.bind(this)();
  }

  setMax() {
    const { store } = this.props;
    const action = store.get("joinexitAction");
    if (action === 0) {
      const daiBalanceDecimal = store.get("daiBalanceDecimal");
      store.set("joinAmount", daiBalanceDecimal);
    } else {
      const chaiBalanceDecimal = store.get("chaiBalanceDecimal");
      store.set("exitAmount", chaiBalanceDecimal);
    }
  }

  handleInput(event) {
    const { store } = this.props;
    const action = store.get("joinexitAction");
    let value;
    try {
      value = new WadDecimal(event.target.value);
    } catch {
      if (event.target.value.length === 0) {
        value = new WadDecimal(0);
      } else {
        return;
      }
    }
    if (action === 0) {
      store.set("joinAmount", value);
    } else {
      store.set("exitAmount", value);
    }
  }
  handleChange(event, newValue) {
    const { store } = this.props;
    store.set("joinexitAction", newValue);
  }

  render() {
    const { classes, store } = this.props;

    const walletAddress = store.get("walletAddress");
    const daiBalance = store.get("daiBalance");
    const daiBalanceDecimal = store.get("daiBalanceDecimal");
    const chaiBalance = store.get("chaiBalance");
    const chaiBalanceDecimal = store.get("chaiBalanceDecimal");
    const joinAmount = store.get("joinAmount");
    const exitAmount = store.get("exitAmount");
    const web3 = store.get("web3");
    const isSignedIn = walletAddress && walletAddress.length;

    const canJoin = joinAmount && joinAmount.cmp(daiBalanceDecimal) < 1;
    const canExit = exitAmount && exitAmount.cmp(chaiBalanceDecimal) < 1;

    const joinexitAction = store.get("joinexitAction");

    return (
      <Card className={classes.card}>
        <Tabs
          value={joinexitAction}
          onChange={this.handleChange.bind(this)}
          centered
        >
          <Tab label="Weth -> scETH" id="join-tab" />
          <Tab label="scETH -> Weth" id="exit-tab" />
        </Tabs>
        <CardContent>
          <Box hidden={joinexitAction !== 0}>
            {" "}
            <Typography variant="subtitle2">
              Start earning interest by converting WETH to scETH
            </Typography>
            <Button
              variant="subtitle2"
              className={classes.accountBalance}
              style={{ textTransform: "none" }}
              onClick={this.setMax.bind(this)}
            >
              {daiBalance ? `Balance: ${daiBalance} WETH` : "-"}
            </Button>
            <TextField
              label="WETH Amount"
              placeholder="0"
              className={classes.input}
              value={joinAmount.toString() !== "0" ? joinAmount : ""}
              margin="normal"
              variant="outlined"
              type="number"
              onChange={this.handleInput.bind(this)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment
                    className={classes.endAdornment}
                    position="end"
                  >
                    WETH
                  </InputAdornment>
                ),
              }}
              helperText={
                isSignedIn && joinAmount
                  ? "You will receive approximately " +
                    toChai.bind(this)(web3.utils.toWei(String(joinAmount))) +
                    " scETH"
                  : " "
              }
            />
            <Button
              color="primary"
              size="large"
              onClick={() => {
                this.join();
              }}
              variant="contained"
              disabled={!isSignedIn || !canJoin}
              className={classes.actionButton}
            >
              Convert
            </Button>
          </Box>
          <Box hidden={joinexitAction !== 1}>
            <Typography variant="subtitle2">
              Convert scETH back to Weth
            </Typography>
            <Button
              variant="subtitle2"
              className={classes.accountBalance}
              style={{ textTransform: "none" }}
              onClick={this.setMax.bind(this)}
            >
              {chaiBalance ? `Balance: ${chaiBalance} scETH` : "-"}
            </Button>
            <TextField
              label="scETH Amount"
              placeholder="0"
              className={classes.input}
              margin="normal"
              variant="outlined"
              value={exitAmount.toString() !== "0" ? exitAmount : ""}
              type="number"
              onChange={this.handleInput.bind(this)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment
                    className={classes.endAdornment}
                    position="end"
                  >
                    scETH
                  </InputAdornment>
                ),
              }}
              helperText={
                isSignedIn && exitAmount
                  ? "You will receive at least: " +
                    toDai.bind(this)(web3.utils.toWei(String(exitAmount))) +
                    " Weth"
                  : " "
              }
            />
            <Button
              color="primary"
              size="large"
              onClick={() => {
                this.exit();
              }}
              variant="contained"
              disabled={!isSignedIn || !canExit}
              className={classes.actionButton}
            >
              Convert
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(withStore(JoinExitContainer));
