import {} from "../utils/web3Utils";
import config from "../config.json";

const poolFee = 500;

// SCETH => WETH
export const exit = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const router = store.get("swapRouterArbitrum");
  const exitAmount = store.get("exitAmount").mul(10 ** 18);
  const walletAddress = store.get("walletAddress");

  const allowance = await scEth.methods
    .allowance(walletAddress, router.options.address)
    .call();

  if (exitAmount.cmp(allowance) > 0) {
    return scEth.methods
      .approve(router.options.address, web3.utils.toTwosComplement(-1))
      .send({ from: walletAddress })
      .then(function () {
        return router.methods
          .exactInputSingle({
            tokenIn: config.scETH_ARBITRUM,
            tokenOut: config.WETH_ARBITRUM,
            fee: poolFee,
            recipient: walletAddress,
            deadline: 17055791578,
            amountIn: exitAmount.toFixed(),
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
          })
          .send({ from: walletAddress });
      });
  }

  return router.methods
    .exactInputSingle({
      tokenIn: config.scETH_ARBITRUM,
      tokenOut: config.WETH_ARBITRUM,
      fee: poolFee,
      recipient: walletAddress,
      deadline: 17055791578,
      amountIn: exitAmount.toFixed(),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    })
    .send({ from: walletAddress });
};

// WETH => SCETH
export const join = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const router = store.get("swapRouterArbitrum");
  const weth = store.get("wethObject");
  const joinAmount = store.get("joinAmount");
  const walletAddress = store.get("walletAddress");

  const allowance = await weth.methods
    .allowance(walletAddress, router.options.address)
    .call();

  // console.log(joinAmount, allowance, joinAmount.cmp(allowance));
  if (joinAmount.cmp(allowance) > 0) {
    return weth.methods
      .approve(router.options.address, web3.utils.toTwosComplement(-1))
      .send({ from: walletAddress })
      .then(function () {
        return router.methods
          .exactInputSingle({
            tokenIn: config.WETH_ARBITRUM,
            tokenOut: config.scETH_ARBITRUM,
            fee: poolFee,
            recipient: walletAddress,
            deadline: 99999999999999,
            amountIn: joinAmount.mul(10 ** 18).toFixed(),
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
          })
          .send({ from: walletAddress });
      });
  }
  return router.methods
    .exactInputSingle({
      tokenIn: config.WETH_ARBITRUM,
      tokenOut: config.scETH_ARBITRUM,
      fee: poolFee,
      recipient: walletAddress,
      deadline: 99999999999999,
      amountIn: joinAmount.mul(10 ** 18).toFixed(),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    })
    .send({ from: walletAddress });
};

export const transfer = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const transferAmount = store.get("transferAmount").mul(10 ** 18);
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
