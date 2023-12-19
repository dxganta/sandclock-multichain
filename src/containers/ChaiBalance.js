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
    const ltv = store.get("ltv");
    const chi = store.get("chi");
    const apy7Day = store.get("apy7Day");
    const apy14Day = store.get("apy14Day");
    const apy30Day = store.get("apy30Day");
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
            7-Day APR :{" "}
            {apy7Day ? (
              <span
                className={apy7Day > 0 ? "apy-green" : "apy-red"}
              >{`${apy7Day}%`}</span>
            ) : (
              "-"
            )}
          </p>
          <p>
            14-Day APR :{" "}
            {apy14Day ? (
              <span
                className={apy14Day > 0 ? "apy-green" : "apy-red"}
              >{`${apy14Day}%`}</span>
            ) : (
              "-"
            )}
          </p>
          <p>
            30-Day APR :{" "}
            {apy30Day ? (
              <span
                className={apy30Day > 0 ? "apy-green" : "apy-red"}
              >{`${apy30Day}%`}</span>
            ) : (
              "-"
            )}
          </p>

          <p>Current LTV: {ltv ? ltv : "-"}</p>
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
