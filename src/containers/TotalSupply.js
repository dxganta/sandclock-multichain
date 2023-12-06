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
      return <p>ETH locked in scETH: {chaiTotalSupply} ETH</p>;
    } else {
      return "";
    }
  }
}

export default withStore(TotalSupplyContainer);
