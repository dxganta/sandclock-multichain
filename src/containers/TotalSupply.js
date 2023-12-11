import React from "react";

import { withStore } from "@spyna/react-store";

class TotalSupplyContainer extends React.Component {
  render() {
    const { store } = this.props;

    let chaiTotalSupply = store.get("chaiTotalSupply");
    let ethUsdRate = store.get("ethUsdRate");

    let usdBalance = chaiTotalSupply * ethUsdRate;

    usdBalance = usdBalance.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (chaiTotalSupply) {
      chaiTotalSupply = chaiTotalSupply.toFormat(2, {
        groupSeparator: ",",
        groupSize: 3,
      });
      return (
        <p>
          ETH locked in scETH: {chaiTotalSupply} ETH ({usdBalance})
        </p>
      );
    } else {
      return "";
    }
  }
}

export default withStore(TotalSupplyContainer);
