import React from "react";

import { withStore } from "@spyna/react-store";
import { withStyles } from "@material-ui/styles";
import theme from "../theme/theme";
import { getData } from "../utils/web3Utils";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

import { toDai } from "../utils/web3Utils";

import logostill from "../assets/logo512.png";

const styles = () => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 52,
  },
});

class ChaiBalanceContainer extends React.Component {
  async componentDidMount() {
    // update data periodically
    this.watchDsrData();
  }

  async watchDsrData() {
    await getData.bind(this)();
    setInterval(() => {
      getData.bind(this)();
    }, 60 * 1000);
  }

  render() {
    const { store } = this.props;
    const dsr = store.get("dsr");
    const chi = store.get("chi");
    const dsrPercent = dsr;
    const chaiBalance = store.get("chaiBalance");
    const chaiBalanceRaw = store.get("chaiBalanceRaw");
    const daiEquiv = chaiBalanceRaw
      ? toDai.bind(this)(chaiBalanceRaw).toFormat(5)
      : undefined;
    return (
      <Card>
        <CardContent>
          <h3>Vault Details</h3>
          <CardMedia
            component="img"
            style={{
              resizeMode: "contain",
              width: 100,
              float: "right",
              paddingRight: 52,
            }}
            src={logostill}
          />
          <p>1 scUSDC = {chi ? `${chi}` : "?"} USDC</p>
          <p>scUSDC balance: {chaiBalance ? `${chaiBalance}` : "-"}</p>
          <p>Equivalent USDC: {chaiBalance ? daiEquiv : "-"}</p>
          <p>
            <a href="https://app.sandclock.org/">Expected APY</a>
          </p>{" "}
          <a
            target="_blank"
            href="https://docs.sandclock.org/current/strategies/v2/opal-scusdc"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(withStore(ChaiBalanceContainer));
