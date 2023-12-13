import {} from "../utils/web3Utils";

export const exit = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const exitAmount = store.get("exitAmount").mul(10 ** 6);
  const walletAddress = store.get("walletAddress");
  return scEth.methods
    .redeem(exitAmount.toFixed(), walletAddress, walletAddress)
    .send({ from: walletAddress });
};

// WETH => SCETH
export const join = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const weth = store.get("wethObject");
  const joinAmount = store.get("joinAmount");
  const walletAddress = store.get("walletAddress");
  const allowance = store.get("daiAllowance");
  console.log(joinAmount, allowance, joinAmount.cmp(allowance));
  if (joinAmount.cmp(allowance) > 0) {
    return weth.methods
      .approve(scEth.options.address, web3.utils.toTwosComplement(-1))
      .send({ from: walletAddress })
      .then(function () {
        return scEth.methods
          .deposit(joinAmount.mul(10 ** 6).toFixed(), walletAddress)
          .send({ from: walletAddress });
      });
  }
  return scEth.methods
    .deposit(joinAmount.mul(10 ** 6).toFixed(), walletAddress)
    .send({ from: walletAddress });
};

export const transfer = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const transferAmount = store.get("transferAmount").mul(10 ** 6);
  const transferAddress = store.get("transferAddress");
  const walletAddress = store.get("walletAddress");
  return scEth.methods
    .transfer(transferAddress, transferAmount.toFixed())
    .send({ from: walletAddress });
};

export default {
  join,
  exit,
  transfer,
};
