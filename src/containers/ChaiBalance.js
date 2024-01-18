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
    const chi = store.get("chi");
    const chaiBalance = store.get("chaiBalance");
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
          <p>1 scETH = {chi ? `${chi}` : "?"} WETH</p>
          <p>scETH balance: {chaiBalance ? `${chaiBalance}` : "-"}</p>
          <a
            target="_blank"
            href="https://docs.sandclock.org/current/strategies/v2/emerald-sceth"
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
