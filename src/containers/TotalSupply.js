import React from "react";

import { withStore } from "@spyna/react-store";

class TotalSupplyContainer extends React.Component {
  render() {
    const { store } = this.props;

    let chaiTotalSupply = store.get("chaiTotalSupply");

    if (chaiTotalSupply) {
      chaiTotalSupply = chaiTotalSupply.toFormat(2, {
        groupSeparator: ",",
        groupSize: 3,
      });
      return <p>USDC locked in scUSDC: {chaiTotalSupply} USDC</p>;
    } else {
      return "";
    }
  }
}

export default withStore(TotalSupplyContainer);
