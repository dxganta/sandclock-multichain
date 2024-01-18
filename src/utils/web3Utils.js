import Web3 from "web3";
import config from "../config.json";
import scEthABI from "../abi/scEth.abi.json";
import wethABI from "../abi/Weth.abi.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import IUniswapV3PoolABI from "../abi/UniswapV3Pool.abi.json";
import SwapRouterABI from "../abi/SwapRouter.abi.json";

let Decimal = require("decimal.js-light");
Decimal = require("toformat")(Decimal);

const scEthAddress = config.scETH_ARBITRUM;
const wethAddress = config.WETH_ARBITRUM;
const quoterAddress = config.UNISWAPV3_QUOTER_ARBITRUM;
const poolAddress = config.UNISWAPV3_ARB_WETH_POOL;

export const WadDecimal = Decimal.clone({
  rounding: 1, // round down
  precision: 78,
  toExpNeg: -18,
  toExpPos: 78,
});

WadDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
};

function toFixed(num, precision) {
  return (+(Math.round(+(num + "e" + precision)) + "e" + -precision)).toFixed(
    precision
  );
}

export const getPotDsr = async function () {
  const { store } = this.props;
  const pot = store.get("potObject");
  if (!pot) return;

  const dsrRaw = await pot.methods.dsr().call();
  if (dsrRaw === store.get("dsrRaw")) return;
  store.set("dsrRaw", dsrRaw);
  let dsr = toFixed(
    new WadDecimal(dsrRaw).div("1e27").pow(secondsInYear).minus(1).mul(100),
    2
  );
  store.set("dsr", dsr.toString());
};

export const getPotChi = async function () {
  const { store } = this.props;
  const quoter = store.get("quoterUniswapV3Arbitrum");

  const chiRaw = await quoter.methods
    .quoteExactInputSingle(
      scEthAddress,
      wethAddress,
      500,
      "1000000000000000000",
      0
    )
    .call();

  if (chiRaw === store.get("chiRaw")) return;
  store.set("chiRaw", chiRaw);
  let chi = toFixed(new WadDecimal(chiRaw).div("1e18"), 5);
  store.set("chi", chi.toString());
};

// get Weth Allowance
// export const getDaiAllowance = async function () {
//   const { store } = this.props;
//   const walletAddress = store.get("walletAddress");
//   const weth = store.get("wethObject");
//   if (!weth || !walletAddress) return;
//   const daiAllowance = await weth.methods
//     .allowance(walletAddress, scEthAddress)
//     .call();
//   store.set("daiAllowance", new WadDecimal(daiAllowance).div("1e18"));
// };

// get Weth Balance
export const getDaiBalance = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const walletAddress = store.get("walletAddress");
  const weth = store.get("wethObject");
  if (!weth || !walletAddress) return;
  const daiBalanceRaw = await weth.methods.balanceOf(walletAddress).call();
  const daiBalanceDecimal = new WadDecimal(daiBalanceRaw).div("1e18");
  store.set("daiBalanceDecimal", daiBalanceDecimal);
  const daiBalance = toFixed(parseFloat(web3.utils.fromWei(daiBalanceRaw)), 5);
  store.set("daiBalance", daiBalance);
};

// get scETH Balance
export const getChaiBalance = async function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  const scEth = store.get("scEthObject");
  const walletAddress = store.get("walletAddress");
  if (!scEth || !walletAddress) return;
  const scEthBalanceRaw = await scEth.methods.balanceOf(walletAddress).call();
  store.set("chaiBalanceRaw", scEthBalanceRaw);
  const scEthBalanceDecimal = new WadDecimal(scEthBalanceRaw).div("1e18");
  store.set("chaiBalanceDecimal", scEthBalanceDecimal);
  const scEthBalance = toFixed(
    parseFloat(web3.utils.fromWei(scEthBalanceRaw)),
    5
  );
  store.set("chaiBalance", scEthBalance);
};

export const toChai = function (daiAmount) {
  const daiDecimal = daiAmount
    ? new WadDecimal(daiAmount).div("1e18")
    : new WadDecimal(0);
  const { store } = this.props;
  if (!store.get("chi")) return;
  const chiDecimal = new WadDecimal(store.get("chi"));
  return toFixed(daiDecimal.div(chiDecimal), 5);
};

export const toDai = function (chaiAmount) {
  const chaiDecimal = chaiAmount
    ? new WadDecimal(chaiAmount).div("1e18")
    : new WadDecimal(0);
  const { store } = this.props;
  if (!store.get("chi")) return;
  const chiDecimal = new WadDecimal(store.get("chi"));
  return chiDecimal.mul(chaiDecimal);
};

export const setupContracts = function () {
  const { store } = this.props;
  const web3 = store.get("web3");
  store.set("scEthObject", new web3.eth.Contract(scEthABI, scEthAddress));
  store.set("wethObject", new web3.eth.Contract(wethABI, wethAddress));
  store.set(
    "quoterUniswapV3Arbitrum",
    new web3.eth.Contract(Quoter.abi, quoterAddress)
  );
  store.set(
    "uniswapV3poolArbitrum",
    new web3.eth.Contract(IUniswapV3PoolABI, poolAddress)
  );
  store.set(
    "swapRouterArbitrum",
    new web3.eth.Contract(SwapRouterABI, config.UNISWAPV3_SWAP_ROUTER_ARBITRUM)
  );
};

export const getData = async function () {
  getPotDsr.bind(this)();
  getPotChi.bind(this)();
  // getDaiAllowance.bind(this)();
  getDaiBalance.bind(this)();
  getChaiBalance.bind(this)();
  // getChaiTotalSupply.bind(this)();
  // updateEthToUsd.bind(this)();
};

const secondsInYear = WadDecimal(60 * 60 * 24 * 365);

export const initBrowserWallet = async function (prompt) {
  const store = this.props.store;

  store.set("walletLoading", true);
  if (!localStorage.getItem("walletKnown") && !prompt) return;

  let web3Provider;

  // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }

    window.ethereum.on("accountsChanged", (accounts) => {
      initBrowserWallet.bind(this)();
    });
  }
  // Legacy dApp browsers...
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, display err
  else {
    console.log("Please install MetaMask!");
    store.set("web3Failure", true);
    return;
  }

  const web3 = new Web3(web3Provider);
  const network = await web3.eth.net.getId();
  store.set("network", network);
  store.set("web3Failure", false);
  store.set("web3", web3);
  const walletType = "browser";
  const accounts = await web3.eth.getAccounts();
  localStorage.setItem("walletKnown", true);
  store.set("walletLoading", false);
  store.set("walletAddress", accounts[0]);
  store.set("walletType", walletType);
  setupContracts.bind(this)();
  getData.bind(this)();
};

export default {
  initBrowserWallet,
  toChai,
  toDai,
};
